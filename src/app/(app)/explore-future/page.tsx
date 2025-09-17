// src/app/(app)/explore-future/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { exploreFuturePathways, ExploreFuturePathwaysOutput } from '@/ai/flows/explore-future-pathways';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Sparkles, Loader2, Wand2, Briefcase, Map, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  interest: z.string().min(3, { message: 'Please enter an interest (e.g., "gaming", "biology").' }),
});

export default function ExploreFuturePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExploreFuturePathwaysOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interest: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResults(null);
    try {
      const result = await exploreFuturePathways({ interest: values.interest });
      setResults(result);
    } catch (error) {
      console.error('Error generating future pathways:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate pathways. Please try a different interest.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
          <Rocket className="text-primary" /> Explore Your Future
        </h1>
        <p className="text-muted-foreground">Turn your passion into a career of tomorrow. What are you interested in?</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="e.g., gaming, biology, space, art..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                <span className="ml-2 hidden md:inline">Generate Pathways</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-semibold">Scanning the future for you...</p>
          <p className="text-muted-foreground">Our AI is charting a course from your interests to tomorrow's careers.</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
           <h2 className="text-2xl font-headline font-bold text-center">Pathways for "{form.getValues('interest')}"</h2>
          {results.pathways.map((pathway, index) => (
            <Card key={index} className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-xl">
                    <Sparkles className="text-accent" /> {pathway.technology}
                </CardTitle>
                <CardDescription>{pathway.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Map className="h-5 w-5 text-primary" /> Your Pathway</h3>
                   <ul className="space-y-2">
                    {pathway.pathway.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                 <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Briefcase className="h-5 w-5 text-primary" /> Potential Careers</h3>
                   <div className="flex flex-wrap gap-2">
                    {pathway.careers.map((career, i) => (
                      <div key={i} className="bg-primary/10 text-primary-foreground font-medium px-3 py-1 rounded-full text-sm bg-primary">{career}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
