import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Lightbulb, LocateFixed, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto h-20 flex items-center justify-between px-4 md:px-6">
        <Logo />
        <Button asChild>
          <Link href="/dashboard">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                Find Your Path to Success.
              </h1>
              <p className="max-w-[600px] text-lg text-foreground/80 md:text-xl">
                Disha Path is your personalized guide to discovering the right courses, colleges, and career opportunities after your 10th and 12th grade.
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-square rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/101/800/800"
                alt="Happy students"
                fill
                className="object-cover"
                data-ai-hint="happy students"
              />
            </div>
          </div>
        </section>

        <section className="bg-background w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">How Disha Path Helps You</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to make informed decisions about your future.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Aptitude & Interest Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">Take our short quiz to discover your strengths and interests. Get personalized course and stream suggestions.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Course-to-Career Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">Visualize your career path. See what jobs, industries, and higher education options are available for each course.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <LocateFixed className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Nearby College Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">Find government colleges near you. Get details on courses, eligibility, facilities, and admission dates.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <div className="flex justify-center">
              <Card className="max-w-3xl">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-accent" />
                  <blockquote className="mt-4 text-xl font-semibold leading-8 tracking-tight text-foreground">
                    "Disha Path cleared all my confusion after 12th grade. I finally understood which course was right for me and found a great government college nearby. Highly recommended!"
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://picsum.photos/seed/102/40/40" alt="Priya S." data-ai-hint="indian student" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Priya S.</p>
                      <p className="text-sm text-foreground/80">Class 12 Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="bg-primary/10 w-full">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32 text-center">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Ready to Find Your Future?</h2>
                <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-4">
                    Take the first step towards a successful career. It's free, easy, and could change your life.
                </p>
                <Button size="lg" className="mt-8" asChild>
                    <Link href="/dashboard">
                        Get Started Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
            <Logo />
            <p className="mt-4 md:mt-0">&copy; {new Date().getFullYear()} Disha Path. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
