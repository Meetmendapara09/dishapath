'use server';
/**
 * @fileOverview An AI agent that suggests suitable academic streams and courses based on a student's quiz results.
 *
 * - suggestCoursesFromQuiz - A function that handles the course suggestion process.
 * - SuggestCoursesFromQuizInput - The input type for the suggestCoursesFromQuiz function.
 * - SuggestCoursesFromQuizOutput - The return type for the suggestCoursesFromQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCoursesFromQuizInputSchema = z.object({
  quizResult: z
    .string()
    .describe(
      'The results from the interest and strengths quiz, as a string.  Include specific scores or categories to allow for accurate suggestions.'
    ),
  careerGoals: z.string().optional().describe('The student’s career goals.'),
});
export type SuggestCoursesFromQuizInput = z.infer<typeof SuggestCoursesFromQuizInputSchema>;

const SuggestCoursesFromQuizOutputSchema = z.object({
  suggestedStreams: z
    .array(z.string())
    .describe('A list of suggested academic streams (Arts, Science, Commerce).'),
  suggestedCourses: z
    .array(z.string())
    .describe('A list of suggested courses based on the quiz results and career goals.'),
  rationale: z
    .string()
    .describe(
      'A detailed and personalized explanation of why these streams and courses are recommended, directly connecting the quiz results and career goals to the suggestions.'
    ),
});
export type SuggestCoursesFromQuizOutput = z.infer<typeof SuggestCoursesFromQuizOutputSchema>;

export async function suggestCoursesFromQuiz(
  input: SuggestCoursesFromQuizInput
): Promise<SuggestCoursesFromQuizOutput> {
  return suggestCoursesFromQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCoursesFromQuizPrompt',
  input: {schema: SuggestCoursesFromQuizInputSchema},
  output: {schema: SuggestCoursesFromQuizOutputSchema},
  prompt: `You are an expert AI career counselor. Your task is to suggest academic streams and courses to students based on their quiz results and career aspirations.

  Analyze the student's quiz results and any stated career goals to recommend suitable academic streams (Arts, Science, Commerce) and specific courses.

  **Most importantly**, you must provide a strong, detailed, and personalized rationale for your suggestions. In the 'rationale' field, explain exactly how the quiz results (e.g., "enjoys solving puzzles," "prefers working with hands") and career goals align with the recommended streams and courses. Make direct connections.

  **Quiz Results:**
  {{{quizResult}}}

  **Career Goals (if any):**
  {{{careerGoals}}}

  Based on this information, provide your suggestions. The quality of your rationale is critical.`,
});

const suggestCoursesFromQuizFlow = ai.defineFlow(
  {
    name: 'suggestCoursesFromQuizFlow',
    inputSchema: SuggestCoursesFromQuizInputSchema,
    outputSchema: SuggestCoursesFromQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
