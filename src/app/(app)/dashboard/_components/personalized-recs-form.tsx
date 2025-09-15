"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalizedCollegeRecommendations } from '@/ai/flows/personalized-college-recommendations';
import type { PersonalizedCollegeRecommendationsOutput } from '@/ai/flows/personalized-college-recommendations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, School, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  age: z.coerce.number().min(14, 'Age must be at least 14').max(25, 'Age must be at most 25'),
  gender: z.string().min(1, 'Gender is required'),
  class: z.string().min(1, 'Class is required'),
  academicInterests: z.string().min(1, 'Academic interests are required'),
  quizResults: z.string().min(1, 'Please provide some info about your interests/strengths'),
  careerGoals: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
});

export function PersonalizedRecsForm() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedCollegeRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 16,
      gender: 'Prefer not to say',
      class: '12th',
      academicInterests: '',
      quizResults: '',
      careerGoals: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendations(null);
    try {
      const result = await personalizedCollegeRecommendations(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="10th">10th</SelectItem>
                      <SelectItem value="11th">11th</SelectItem>
                      <SelectItem value="12th">12th</SelectItem>
                      <SelectItem value="Passed 12th">Passed 12th</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="academicInterests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Interests</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Science, Arts, Commerce" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quizResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests, Strengths & Personality</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your interests (e.g., 'I enjoy solving puzzles'), strengths (e.g., 'Good at math'), and personality (e.g., 'Introverted'). You can also use results from our quiz." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="careerGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Goals (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Become a software engineer, start a business" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your City/Town</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Delhi, Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </Button>
        </form>
      </Form>

      {recommendations && (
        <Card className="mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-accent" /> Here are your personalized recommendations!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><GraduationCap className="h-5 w-5 text-primary" />Recommended Courses</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedCourses.map((course) => (
                  <div key={course} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">{course}</div>
                ))}
              </div>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><School className="h-5 w-5 text-primary" />Nearby Colleges</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.nearbyColleges.map((college) => (
                  <div key={college} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">{college}</div>
                ))}
              </div>
            </div>
             <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Briefcase className="h-5 w-5 text-primary" />Potential Career Paths</h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.careerPaths.map((path) => (
                  <div key={path} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">{path}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
