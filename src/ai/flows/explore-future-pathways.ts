'use server';

/**
 * @fileOverview An AI agent that connects user interests to future technologies and provides pathways to get there.
 *
 * - exploreFuturePathways - A function that generates future career pathways.
 * - ExploreFuturePathwaysInput - The input type for the function.
 * - ExploreFuturePathwaysOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExploreFuturePathwaysInputSchema = z.object({
  interest: z.string().describe('The user\'s stated interest, e.g., "gaming", "biology", "space".'),
});
export type ExploreFuturePathwaysInput = z.infer<typeof ExploreFuturePathwaysInputSchema>;

const PathwaySchema = z.object({
    technology: z.string().describe('The name of the future technology or field.'),
    description: z.string().describe('A brief, exciting description of this field and why it matters.'),
    pathway: z.array(z.string()).describe('A list of actionable steps or milestones to enter this field, e.g., "Pursue a B.Tech in Computer Science", "Learn Python and ML frameworks", "Contribute to open-source AI projects".'),
    careers: z.array(z.string()).describe('A list of potential job titles in this field.'),
});

const ExploreFuturePathwaysOutputSchema = z.object({
  pathways: z.array(PathwaySchema).describe('A list of potential future pathways related to the user\'s interest.'),
});
export type ExploreFuturePathwaysOutput = z.infer<typeof ExploreFuturePathwaysOutputSchema>;


export async function exploreFuturePathways(
  input: ExploreFuturePathwaysInput
): Promise<ExploreFuturePathwaysOutput> {
  return exploreFuturePathwaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exploreFuturePathwaysPrompt',
  input: { schema: ExploreFuturePathwaysInputSchema },
  output: { schema: ExploreFuturePathwaysOutputSchema },
  prompt: `You are a futurist and career counselor for students in India. Your goal is to inspire them by connecting their passions to cutting-edge, future-focused career fields.

  A student has shared their interest: {{{interest}}}

  Based on this interest, identify 2-3 emerging or future technologies and fields. For each field:
  1.  Provide an exciting, one-paragraph description of the technology and its potential impact.
  2.  Outline a clear, step-by-step "pathway" a student in India could follow. Start from 12th grade subjects, mention relevant undergraduate degrees (like B.Tech, B.Sc), suggest key skills to learn (e.g., programming languages, lab techniques), and recommend extracurriculars (e.g., projects, internships).
  3.  List a few specific, future-oriented job titles within that field.

  Keep the tone optimistic and inspiring. The goal is to make the future feel accessible and exciting.`,
});

const exploreFuturePathwaysFlow = ai.defineFlow(
  {
    name: 'exploreFuturePathwaysFlow',
    inputSchema: ExploreFuturePathwaysInputSchema,
    outputSchema: ExploreFuturePathwaysOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      input,
      output: {schema: ExploreFuturePathwaysOutputSchema},
    });
    return output!;
  }
);
