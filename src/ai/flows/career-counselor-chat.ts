// src/ai/flows/career-counselor-chat.ts
'use server';

/**
 * @fileOverview Provides an AI-powered career counselor chatbot.
 *
 * - careerCounselorChat - A function that streams a response from the chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {stream} from 'genkit/stream';

const CareerCounselorInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({text: z.string()})),
    })
  ),
  message: z.string(),
});

const prompt = ai.definePrompt({
  name: 'careerCounselorPrompt',
  input: {schema: CareerCounselorInputSchema},
  prompt: `You are an expert career and education counselor for Indian students who have completed 10th or 12th grade. Your name is 'Disha Path AI Assistant'.

  You are having a conversation with a student. Your goal is to provide helpful, encouraging, and accurate advice.

  - If the user asks about you, introduce yourself as the Disha Path AI assistant, an expert counselor designed to guide students.
  - Keep your responses concise and easy to read. Use markdown for formatting like lists and bold text when it improves readability.
  - Your knowledge base includes information about:
    - Academic streams (Science, Commerce, Arts)
    - Various courses and degrees available in India after 10th and 12th.
    - Career paths associated with these courses.
    - Entrance exams (like JEE, NEET, CUET, etc.).
    - Government colleges and scholarships in India.
  - If a question is outside of this scope, politely state that you are focused on career and education counseling for Indian students. Do not answer unrelated questions (e.g., about politics, celebrities, or random facts).

  Here is the conversation history:
  {{#each history}}
    {{#if (eq role 'user')}}From User:
    - {{#each content}}{{text}}{{/each}}
    {{/if}}
    {{#if (eq role 'model')}}From You:
    - {{#each content}}{{text}}{{/each}}
    {{/if}}
  {{/each}}

  Now, here is the new message from the user:
  {{message}}

  Your response:
  `,
});

export async function careerCounselorChat(
  history: z.infer<typeof CareerCounselorInputSchema>['history'],
  message: string
) {
  const {stream, response} = await ai.generateStream({
    model: 'googleai/gemini-2.5-flash',
    prompt: await prompt({history, message}),
    history,
  });

  return stream(async function* (chunk) {
    for await (const c of chunk) {
      yield c.text;
    }
  });
}
