// src/ai/flows/career-counselor-chat.ts
'use server';

/**
 * @fileOverview Provides an AI-powered career counselor chatbot.
 *
 * - careerCounselorChat - A function that  // Serialize messages into a plain string prompt because ai.generateStream expects a string or specific parts, not the message objects used here.
  const prompt = messages
    .map((m: any) => {
      const role =
        m.role === 'model' ? 'system' : m.role === 'user' ? 'user' : m.role;
      const content = Array.isArray(m.content)
        ? m.content.map((c: any) => c.text).join('\n')
        : String(m.content ?? '');
      return `${role.toUpperCase()}: ${content}`;
    })
    .join('\n\n');

  // Retry logic for rate limits
  let attempts = 0;
  const maxAttempts = 3;
  const baseDelay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    try {
      const streamResponse = await ai.generateStream(prompt);sponse from the chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';

// Helper function to convert Firestore docs to a simplified format for the AI
function formatDocs(docs: DocumentData[]): string {
  return docs.map(doc => JSON.stringify(doc.data())).join(', ');
}

// Tool to find careers
const findCareers = ai.defineTool(
  {
    name: 'findCareers',
    description:
      'Search for career paths based on a stream (e.g., Science, Commerce, Arts).',
    inputSchema: z.object({
      stream: z.string().describe('The academic stream to search for.'),
    }),
    outputSchema: z.string(),
  },
  async ({stream}) => {
    const q = query(
      collection(db, 'careers'),
      where('stream', '==', stream),
      limit(5)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return `No careers found for the ${stream} stream. Suggest exploring other streams.`;
    }
    return `Here are some careers for the ${stream} stream: ${formatDocs(snapshot.docs)}`;
  }
);

// Tool to find colleges
const findColleges = ai.defineTool(
  {
    name: 'findColleges',
    description: 'Search for colleges based on a course or city.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search term, which can be a course name or a city name.'
        ),
    }),
    outputSchema: z.string(),
  },
  async ({query: searchTerm}) => {
    // Search by course
    const courseQuery = query(
      collection(db, 'colleges'),
      where('courses', 'array-contains', searchTerm),
      limit(3)
    );
    const courseSnapshot = await getDocs(courseQuery);
    if (!courseSnapshot.empty) {
      return `Here are some colleges offering ${searchTerm}: ${formatDocs(courseSnapshot.docs)}`;
    }
    // As a fallback, try searching by name (if we assume query is a city, Firestore doesn't support it well)
    return `I couldn't find colleges specifically for "${searchTerm}". You can browse all colleges on the "Find Colleges" page.`;
  }
);

// Tool to find exams
const findExams = ai.defineTool(
  {
    name: 'findExams',
    description:
      'Search for entrance exams. Can be searched by exam name or purpose.',
    inputSchema: z.object({
      query: z
        .string()
        .describe('The name of the exam or the purpose (e.g., "Engineering")'),
    }),
    outputSchema: z.string(),
  },
  async ({query: searchTerm}) => {
    const purposeQuery = query(
      collection(db, 'exams'),
      where('purpose', '==', searchTerm),
      limit(3)
    );
    const purposeSnapshot = await getDocs(purposeQuery);
    if (!purposeSnapshot.empty) {
      return `Here are some exams for ${searchTerm}: ${formatDocs(purposeSnapshot.docs)}`;
    }
    return `I couldn't find exams for "${searchTerm}". You can browse all exams on the "Exams" page.`;
  }
);


const CareerCounselorInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model', 'tool']),
      content: z.array(z.object({text: z.string()})),
    })
  ),
  message: z.string(),
  userProfile: z.object({
    displayName: z.string().optional(),
    class: z.string().optional(),
    academicInterests: z.string().optional(),
  }).optional(),
});

export async function careerCounselorChat(
  history: z.infer<typeof CareerCounselorInputSchema>['history'],
  message: string,
  userProfile?: z.infer<typeof CareerCounselorInputSchema>['userProfile'],
): Promise<ReadableStream<Uint8Array>> {
  // Construct the messages array
  const messages = [];

  // Add system message with context
  const systemMessage = `You are an expert career and education counselor for Indian students who have completed 10th or 12th grade. Your name is 'Lakshya360 AI Assistant'.

  You are having a conversation with a student. Your goal is to provide detailed, helpful, encouraging, and accurate advice. Your responses should be well-structured, easy to read, and use markdown for formatting like lists and bold text.

  - If the user asks about you, introduce yourself as the Lakshya360 AI assistant.
  - Your knowledge base includes information about:
    - Academic streams (Science, Commerce, Arts)
    - Various courses and degrees available in India.
    - Career paths associated with these courses.
    - Entrance exams (like JEE, NEET, CUET, etc.).
    - Government colleges and scholarships in India.
  - If a question is outside of this scope, politely state that you are focused on career and education counseling.

  Here is the student's profile:
  - Name: ${userProfile?.displayName || 'Not provided'}
  - Class: ${userProfile?.class || 'Not provided'}
  - Interests: ${userProfile?.academicInterests || 'Not provided'}

  Based on their profile and the conversation, be proactive:
  - If their interests are not clear, suggest they take the "Aptitude Quiz" on the platform.
  - If they ask about careers for a stream, use the \`findCareers\` tool.
  - If they ask about colleges for a course, use the \`findColleges\` tool.
  - If they ask about exams, use the \`findExams\` tool.
  - Mention specific pages on the platform like "Explore Careers" or "Find Colleges" when relevant.`;

  messages.push({ role: 'model', content: [{ text: systemMessage }] });

  // Add conversation history
  for (const h of history) {
    messages.push({
      role: h.role === 'model' ? 'model' : 'user',
      content: h.content
    });
  }

  // Add the new user message
  messages.push({ role: 'user', content: [{ text: message }] });

  // Serialize messages into a plain string prompt because ai.generateStream expects a string or specific parts, not the message objects used here.
  const prompt = messages
    .map((m: any) => {
      const role =
        m.role === 'model' ? 'system' : m.role === 'user' ? 'user' : m.role;
      const content = Array.isArray(m.content)
        ? m.content.map((c: any) => c.text).join('\n')
        : String(m.content ?? '');
      return `${role.toUpperCase()}: ${content}`;
    })
    .join('\n\n');

  // Retry logic for rate limits
  let attempts = 0;
  const maxAttempts = 3;
  const baseDelay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    try {
      const streamResponse = await ai.generateStream(prompt);

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of streamResponse.stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        },
      });

      return readableStream;
    } catch (error: any) {
      if (error.status === 429 && attempts < maxAttempts - 1) {
        // Rate limit hit, wait and retry
        const delay = baseDelay * Math.pow(2, attempts); // Exponential backoff
        console.log(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
      } else {
        // Re-throw if not a rate limit or max attempts reached
        throw error;
      }
    }
  }

  throw new Error('Max retry attempts reached for AI request');
}
