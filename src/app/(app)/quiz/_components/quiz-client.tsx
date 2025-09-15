"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestCoursesFromQuiz } from '@/ai/flows/suggest-courses-from-quiz';
import type { SuggestCoursesFromQuizOutput } from '@/ai/flows/suggest-courses-from-quiz';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const questions = [
  {
    name: "q1",
    label: "Which subjects do you enjoy the most?",
    options: ["Physics, Chemistry, Math (PCM)", "Physics, Chemistry, Biology (PCB)", "Accounting, Business Studies, Economics", "History, Political Science, Literature", "Something else / a mix"],
  },
  {
    name: "q2",
    label: "What kind of activities do you prefer?",
    options: ["Solving complex problems and puzzles", "Building or fixing things with your hands", "Expressing yourself through art, music, or writing", "Helping or leading other people", "Organizing information and planning events"],
  },
  {
    name: "q3",
    label: "What is your ideal work environment?",
    options: ["A quiet, focused space like a lab or library", "A dynamic, collaborative office", "Outdoors or in the field", "A creative studio or workshop", "It doesn't matter to me"],
  },
];

const formSchema = z.object({
  q1: z.string().min(1, { message: "Please select an option." }),
  q2: z.string().min(1, { message: "Please select an option." }),
  q3: z.string().min(1, { message: "Please select an option." }),
  careerGoals: z.string().optional(),
});

export function QuizClient() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SuggestCoursesFromQuizOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { q1: "", q2: "", q3: "", careerGoals: "" },
  });

  const handleNext = async () => {
    const fieldToValidate = questions[step].name as "q1" | "q2" | "q3";
    const isValid = await form.trigger(fieldToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResults(null);
    const quizResult = `
      Enjoyed subjects: ${values.q1}.
      Preferred activities: ${values.q2}.
      Ideal environment: ${values.q3}.
    `;
    try {
      const result = await suggestCoursesFromQuiz({ quizResult, careerGoals: values.careerGoals });
      setResults(result);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Analyzing your answers...</p>
            <p className="text-muted-foreground">Our AI is crafting your personalized recommendations.</p>
        </div>
    )
  }

  if (results) {
    return (
        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Sparkles className="text-accent" /> Here's What We Suggest
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Suggested Streams</h3>
                    <div className="flex flex-wrap gap-2">
                        {results.suggestedStreams.map((stream) => (
                            <div key={stream} className="bg-accent/20 text-accent-foreground font-bold px-4 py-2 rounded-full">{stream}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Suggested Courses</h3>
                    <div className="flex flex-wrap gap-2">
                        {results.suggestedCourses.map((course) => (
                            <div key={course} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">{course}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Our Rationale</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{results.rationale}</p>
                </div>
                <Button onClick={() => { setResults(null); form.reset(); setStep(0); }}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Take Quiz Again
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Progress value={(step / (questions.length + 1)) * 100} className="w-full" />
        
        {questions.map((q, index) => (
          <div key={q.name} className={step === index ? 'block' : 'hidden'}>
            <FormField
              control={form.control}
              name={q.name as "q1" | "q2" | "q3"}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">{q.label}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {q.options.map(option => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option} />
                          </FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        {step === questions.length && (
          <div>
            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">What are your career goals? (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., become a doctor, start a business, explore research..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : <div />}

          {step < questions.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Suggestions
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
