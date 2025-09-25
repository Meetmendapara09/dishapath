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
  rationale: z
    .string()
    .describe(
      'A clear, personalized rationale explaining *why* these recommendations are a good fit for the student, connecting their interests, strengths, and goals to the suggestions.'
    ),
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
  prompt: `You are an AI-powered career and education advisor. Your goal is to provide excellent, personalized recommendations.

Based on the following student profile, provide personalized recommendations for courses, colleges, and career paths.

Student Profile:
- Age: {{{age}}}
- Gender: {{{gender}}}
- Class: {{{class}}}
- Academic Interests: {{{academicInterests}}}
- Quiz Results (Interests, Strengths, Personality): {{{quizResults}}}
- Career Goals: {{{careerGoals}}}
- Location: {{{location}}}

Your task:
1.  **Analyze the profile:** Deeply consider the student's interests, strengths, personality traits, and location.
2.  **Recommend Courses, Colleges, and Careers:** Suggest specific courses, potential nearby colleges (be general if you're unsure), and aligned career paths.
3.  **Provide a Strong Rationale:** This is the most important part. In the 'rationale' field, write a clear, encouraging, and detailed explanation. Justify *why* you are recommending each course and career path. Connect your suggestions directly to the student's stated interests, strengths, and goals. For example, "Because you enjoy solving puzzles and are good at math, a career in Data Science could be a great fit. A Bachelor of Science in Computer Science would be an excellent first step."

If the gender is 'Prefer not to say', do not use gender as a factor in your recommendations.

Output the recommendations in the required JSON format.`,
});

const personalizedCollegeRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCollegeRecommendationsFlow',
    inputSchema: PersonalizedCollegeRecommendationsInputSchema,
    outputSchema: PersonalizedCollegeRecommendationsOutputSchema,
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
          console.log(`Rate limit hit in personalized recommendations, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempts++;
        } else {
          // Re-throw if not a rate limit or max attempts reached
          throw error;
        }
      }
    }

    throw new Error('Max retry attempts reached for personalized recommendations AI request');
  }
);
