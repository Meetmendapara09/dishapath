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
      'A detailed explanation of why these streams and courses are recommended, aligning the quiz results and career goals.'
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
  prompt: `You are an AI career counselor specializing in suggesting academic streams and courses to students based on their interests, strengths, and career goals.

  Analyze the student's quiz results and career goals to recommend suitable academic streams (Arts, Science, Commerce) and specific courses.
  Provide a rationale for each suggestion, explaining how it aligns with the student's profile.

  Quiz Results: {{{quizResult}}}
  Career Goals: {{{careerGoals}}}

  Based on this information, suggest academic streams and courses.
  Be sure to explain the reasoning for each suggestion in the rationale section.`,
});

const suggestCoursesFromQuizFlow = ai.defineFlow(
  {
    name: 'suggestCoursesFromQuizFlow',
    inputSchema: SuggestCoursesFromQuizInputSchema,
    outputSchema: SuggestCoursesFromQuizOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: await prompt.render({input}),
      output: {schema: SuggestCoursesFromQuizOutputSchema},
    });
    return output!;
  }
);
