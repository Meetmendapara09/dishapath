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
        location: data.location,
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

    // Apply filters sequentially
    if (course) {
      q = query(q, where('courses', 'array-contains', course));
    }
    if (facility) {
      q = query(q, where('facilities', 'array-contains', facility));
    }
    if (name) {
      // Using >= and <= for a "starts with" search
      q = query(q, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    }
    if (city && !course && !facility && !name) {
      // If only city is specified, search for city in the name
      q = query(q, where('name', '>=', city), where('name', '<=', city + '\uf8ff'));
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs;

    // If we have city and other filters, we might need to filter client-side
    if (city && (course || facility || name)) {
      // For complex queries, we might need to fetch more and filter
      const allQuery = query(collection(db, 'colleges'), limit(50));
      const allSnapshot = await getDocs(allQuery);
      results = allSnapshot.docs.filter(doc => {
        const data = doc.data();
        const nameMatch = !name || data.name.toLowerCase().includes(name.toLowerCase());
        const courseMatch = !course || (data.courses && data.courses.includes(course));
        const facilityMatch = !facility || (data.facilities && data.facilities.includes(facility));
        const cityMatch = !city || data.name.toLowerCase().includes(city.toLowerCase());
        return nameMatch && courseMatch && facilityMatch && cityMatch;
      }).slice(0, 10);
    }

    // If no results from DB, fall back to sample data
    if (results.length === 0) {
      const sampleColleges = [
        { name: 'Indian Institute of Technology, Jammu', location: 'Jammu', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
        { name: 'Indian Institute of Technology, Delhi', location: 'Delhi', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
        { name: 'Indian Institute of Technology, Bombay', location: 'Mumbai', courses: ['B.Tech', 'B.Des', 'M.Sc'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
        { name: 'Indian Institute of Science Education and Research, Pune', location: 'Pune', courses: ['BS-MS Dual Degree', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
        { name: 'National Institute of Science Education and Research, Bhubaneswar', location: 'Bhubaneswar', courses: ['Integrated M.Sc'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
      ];

      results = sampleColleges.filter(college => {
        const nameMatch = !name || college.name.toLowerCase().includes(name.toLowerCase());
        const courseMatch = !course || college.courses.includes(course);
        const facilityMatch = !facility || college.facilities.includes(facility);
        const cityMatch = !city || college.location.toLowerCase().includes(city.toLowerCase()) || college.name.toLowerCase().includes(city.toLowerCase());
        return nameMatch && courseMatch && facilityMatch && cityMatch;
      }).map(college => ({ data: () => college } as any));
    }

    return formatDocs(results);
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
      location: z.string().optional(),
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
  // Retry logic for rate limits
  let attempts = 0;
  const maxAttempts = 3;
  const baseDelay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error.status === 429 && attempts < maxAttempts - 1) {
        // Rate limit hit, wait and retry
        const delay = baseDelay * Math.pow(2, attempts); // Exponential backoff
        console.log(`Rate limit hit in college search, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
      } else {
        // Re-throw if not a rate limit or max attempts reached
        throw error;
      }
    }
  }

  throw new Error('Max retry attempts reached for college search AI request');
}
