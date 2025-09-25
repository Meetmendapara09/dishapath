// src/ai/flows/day-in-a-life-story-generator.ts
'use server';

/**
 * @fileOverview An AI agent that generates a "day in the life" story for a given career.
 *
 * - generateDayInLifeStory - A function that generates the story.
 * - DayInLifeStoryInput - The input type for the function.
 * - DayInLife-in-a-life-story-generator.ts
InLifeStoryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DayInLifeStoryInputSchema = z.object({
  career: z.string().describe('The career to generate the story for.'),
});
export type DayInLifeStoryInput = z.infer<typeof DayInLifeStoryInputSchema>;

const DayInLifeStoryOutputSchema = z.object({
  title: z.string().describe('A creative title for the story.'),
  story: z
    .string()
    .describe('A first-person narrative story about a typical day in the specified career. Use markdown for formatting.'),
});
export type DayInLifeStoryOutput = z.infer<typeof DayInLifeStoryOutputSchema>;

export async function generateDayInLifeStory(
  input: DayInLifeStoryInput
): Promise<DayInLifeStoryOutput> {
  return dayInLifeStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dayInLifeStoryPrompt',
  input: {schema: DayInLifeStoryInputSchema},
  output: {schema: DayInLifeStoryOutputSchema},
  prompt: `You are a creative writer who specializes in writing engaging "A Day in the Life" stories for students exploring career options in India.

  Your task is to write a short, first-person narrative story about a typical day for someone working as a {{{career}}}.

  The story must be:
  - Vivid, engaging, interesting, and easy to read for a high school student.
  - Informative, highlighting key tasks, challenges, and rewarding aspects of the job. It should include specific details about the daily routine, tools or software used, and interactions with colleagues or clients.
  - Told from a first-person perspective (e.g., "My day started with...").
  - Set in a realistic Indian context (mentioning a city or relatable work culture details is a plus).
  - Formatted with markdown (e.g., headings, bold text, lists) to improve readability.
  - Conclude with a personal reflection on the career at the end of the day.
  - Start with a creative and compelling title.

  Generate a story for the career: {{{career}}}`,
});

const dayInLifeStoryFlow = ai.defineFlow(
  {
    name: 'dayInLifeStoryFlow',
    inputSchema: DayInLifeStoryInputSchema,
    outputSchema: DayInLifeStoryOutputSchema,
  },
  async input => {
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
          console.log(`Rate limit hit in day in life story, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempts++;
        } else {
          // Re-throw if not a rate limit or max attempts reached
          throw error;
        }
      }
    }

    throw new Error('Max retry attempts reached for day in life story AI request');
  }
);
