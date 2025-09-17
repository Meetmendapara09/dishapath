'use server';

/**
 * @fileOverview An AI agent that finds colleges based on natural language queries.
 *
 * - findCollegesFlow - A function that handles the college finding process.
 * - FindCollegesInput - The input type for the findCollegesFlow function.
 * - FindCollegesOutput - The return type for the findCollegesFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  DocumentData,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';

// Helper function to format Firestore documents for the AI model
function formatDocs(docs: DocumentData[]): string {
  if (!docs.length) return 'No colleges found.';
  return docs
    .map(doc => {
      const data = doc.data();
      // Only include key fields to keep the context concise for the AI
      return JSON.stringify({
        name: data.name,
        courses: data.courses,
        facilities: data.facilities,
        medium: data.medium,
      });
    })
    .join(', ');
}

// Define the tool for the AI to find colleges in the database
const findCollegesTool = ai.defineTool(
  {
    name: 'findColleges',
    description:
      'Search for colleges based on criteria like course, city, facilities, or name.',
    inputSchema: z.object({
      course: z.string().optional().describe('A specific course to search for, e.g., "B.Tech"'),
      city: z.string().optional().describe('The city where the college is located, e.g., "Mumbai"'),
      facility: z.string().optional().describe('A facility to filter by, e.g., "Hostel"'),
      name: z.string().optional().describe('The name of a specific college'),
    }),
    outputSchema: z.string(),
  },
  async ({course, city, facility, name}) => {
    let q = query(collection(db, 'colleges'), limit(10));

    // Firestore does not support multiple 'array-contains' or '!=' clauses, so we apply filters sequentially.
    // This is a simplified search. For more complex queries, a dedicated search service like Algolia would be better.
    if (course) {
      q = query(q, where('courses', 'array-contains', course));
    }
    if (facility) {
      q = query(q, where('facilities', 'array-contains', facility));
    }
    if (name) {
      // Using >= and <= for a "starts with" search, as Firestore doesn't have native full-text search.
      q = query(q, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    }
     // Note: City-based filtering is complex without a dedicated field. This tool simulates it based on name or assumes location data.

    const snapshot = await getDocs(q);
    return formatDocs(snapshot.docs);
  }
);


const FindCollegesInputSchema = z.object({
  query: z.string().describe('The user\'s natural language search query.'),
});
export type FindCollegesInput = z.infer<typeof FindCollegesInputSchema>;


const FindCollegesOutputSchema = z.object({
  colleges: z.array(
    z.object({
      name: z.string(),
      courses: z.array(z.string()),
      facilities: z.array(z.string()),
      medium: z.string(),
    })
  ),
  summary: z.string().describe('A brief, insightful, and helpful summary of the search results for the user.'),
});
export type FindCollegesOutput = z.infer<typeof FindCollegesOutputSchema>;


const prompt = ai.definePrompt({
  name: 'findCollegesPrompt',
  input: {schema: FindCollegesInputSchema},
  output: {schema: FindCollegesOutputSchema},
  tools: [findCollegesTool],
  prompt: `You are an AI assistant for the Lakshya360 platform. Your task is to help students find government colleges in India.

  1.  Analyze the user's query: {{{query}}}
  2.  Identify key criteria like course names, city, facilities, or specific college names.
  3.  Use the 'findColleges' tool to search the database based on the identified criteria. You can make multiple tool calls if needed to explore different criteria.
  4.  From the tool's output (which is a JSON string of college data), populate the 'colleges' array in your final response.
  5.  Write a friendly, concise, and helpful 'summary' of the results for the user. If no colleges were found, explain why and suggest a different, more effective search strategy. If colleges were found, highlight one or two interesting options.

  Example Query: "show me colleges in Mumbai with a B.Com course"
  - You would call the tool with: { city: "Mumbai", course: "B.Com" }
  
  Example Query: "colleges with a hostel"
  - You would call the tool with: { facility: "Hostel" }
  `,
});

export async function findCollegesFlow(
  input: FindCollegesInput
): Promise<FindCollegesOutput> {
  const {output} = await prompt(input);
  return output!;
}
