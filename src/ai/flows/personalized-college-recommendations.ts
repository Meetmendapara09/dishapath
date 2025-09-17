// src/ai/flows/personalized-college-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized college and career recommendations based on student profile, preferences, and aptitude.
 *
 * - personalizedCollegeRecommendations - A function that returns personalized college and career recommendations.
 * - PersonalizedCollegeRecommendationsInput - The input type for the personalizedCollegeRecommendations function.
 * - PersonalizedCollegeRecommendationsOutput - The return type for the personalizedCollegeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCollegeRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the student.'),
  gender: z.string().describe('The gender of the student.'),
  class: z.string().describe('The current class of the student (e.g., 10, 12).'),
  academicInterests: z
    .string()
    .describe('The academic interests of the student (e.g., science, arts, commerce).'),
  quizResults: z
    .string()
    .describe(
      'The results of the aptitude quiz taken by the student, including interests, strengths and personality traits.'
    ),
  careerGoals: z.string().optional().describe('The career goals of the student, if any.'),
  location: z.string().describe('The current location of the student.'),
});

export type PersonalizedCollegeRecommendationsInput = z.infer<
  typeof PersonalizedCollegeRecommendationsInputSchema
>;

const PersonalizedCollegeRecommendationsOutputSchema = z.object({
  recommendedCourses: z
    .array(z.string())
    .describe('A list of recommended courses based on the student profile.'),
  nearbyColleges: z
    .array(z.string())
    .describe('A list of nearby colleges based on the student location.'),
  careerPaths: z
    .array(z.string())
    .describe('A list of career paths aligned with the student aptitude.'),
});

export type PersonalizedCollegeRecommendationsOutput = z.infer<
  typeof PersonalizedCollegeRecommendationsOutputSchema
>;

export async function personalizedCollegeRecommendations(
  input: PersonalizedCollegeRecommendationsInput
): Promise<PersonalizedCollegeRecommendationsOutput> {
  return personalizedCollegeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCollegeRecommendationsPrompt',
  input: {schema: PersonalizedCollegeRecommendationsInputSchema},
  output: {schema: PersonalizedCollegeRecommendationsOutputSchema},
  prompt: `You are an AI-powered career and education advisor.

Based on the following student profile, provide personalized recommendations for courses, colleges, and career paths.

Student Profile:
- Age: {{{age}}}
- Gender: {{{gender}}}
- Class: {{{class}}}
- Academic Interests: {{{academicInterests}}}
- Quiz Results: {{{quizResults}}}
- Career Goals: {{{careerGoals}}}
- Location: {{{location}}}

Consider the student's interests, strengths, personality traits, and location when making recommendations.
If the gender is 'Prefer not to say', do not use gender as a factor in your recommendations.

Output the recommendations in JSON format.`,
});

const personalizedCollegeRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCollegeRecommendationsFlow',
    inputSchema: PersonalizedCollegeRecommendationsInputSchema,
    outputSchema: PersonalizedCollegeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      input,
      output: {schema: PersonalizedCollegeRecommendationsOutputSchema},
    });
    return output!;
  }
);
