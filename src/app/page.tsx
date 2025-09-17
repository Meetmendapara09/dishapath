import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  LocateFixed,
  Quote,
  Sparkles,
  School,
  Trophy,
  ClipboardEdit,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';

const keyFeatures = [
  {
    icon: Lightbulb,
    title: 'Aptitude Quiz',
    description: 'Discover your strengths and get personalized course suggestions.',
  },
  {
    icon: MessageSquare,
    title: 'AI Counselor',
    description: 'Get instant answers to all your career-related questions.',
  },
  {
    icon: BookOpen,
    title: 'Career Paths',
    description: 'Explore detailed career maps from courses to jobs.',
  },
  {
    icon: School,
    title: 'College Directory',
    description: 'Find information about government colleges near you.',
  },
  {
    icon: Trophy,
    title: 'Scholarships',
    description: 'Search and apply for scholarships to fund your education.',
  },
  {
    icon: ClipboardEdit,
    title: 'Exam Information',
    description: 'Stay updated on all major entrance exams in India.',
  },
];


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto h-20 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Logo />
        <Button asChild>
          <Link href="/login">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl text-primary leading-tight">
                Your Future, Illuminated.
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-lg text-foreground/80 md:text-xl">
                Disha Path is your AI-powered copilot for navigating the complex world of education and careers in India. Discover your perfect path, today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                   <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-500">
               <Image
                src="https://picsum.photos/seed/101/800/600"
                alt="Happy students looking towards the future"
                fill
                className="object-cover"
                data-ai-hint="happy students future"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="bg-primary/5 w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <p className="font-semibold text-primary">HOW IT WORKS</p>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Your 3-Step Guide to Clarity</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shadow-lg border-4 border-background">1</div>
                <h3 className="text-xl font-headline font-bold mt-6">Take the Quiz</h3>
                <p className="text-foreground/80 mt-2">Our smart quiz identifies your unique interests and strengths.</p>
              </div>
               <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shadow-lg border-4 border-background">2</div>
                <h3 className="text-xl font-headline font-bold mt-6">Get AI Recommendations</h3>
                <p className="text-foreground/80 mt-2">Receive personalized suggestions for courses, careers, and colleges.</p>
              </div>
               <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shadow-lg border-4 border-background">3</div>
                <h3 className="text-xl font-headline font-bold mt-6">Explore & Decide</h3>
                <p className="text-foreground/80 mt-2">Use our rich database to research and finalize your best options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                 <p className="font-semibold text-primary">FEATURES</p>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">An Entire Ecosystem for Your Success</h2>
                 <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed">
                  Everything you need to make confident decisions about your future, all in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyFeatures.map((feature) => (
                    <Card key={feature.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className="bg-primary/10 p-3 rounded-full">
                                <feature.icon className="h-6 w-6 text-primary" />
                             </div>
                            <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-foreground/80">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="bg-primary/5 w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <Quote className="h-10 w-10 text-accent mx-auto" />
                    <blockquote className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-foreground">
                        "Disha Path cleared all my confusion after 12th grade. I finally understood which course was right for me and found a great government college nearby. It's a game-changer!"
                    </blockquote>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Avatar className="h-12 w-12">
                        <AvatarImage src="https://picsum.photos/seed/102/60/60" alt="Priya S." data-ai-hint="indian student" />
                        <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-semibold text-lg">Priya S.</p>
                        <p className="text-sm text-foreground/80">Class 12 Student, Jaipur</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="w-full">
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Ready to Find Your Future?</h2>
                <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-4">
                    Take the first step towards a successful career. It's free, easy, and could change your life.
                </p>
                <Button size="lg" className="mt-8" asChild>
                    <Link href="/login">
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
            <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="#features" className="hover:text-primary">Features</Link>
                <Link href="/login" className="hover:text-primary">Login</Link>
            </div>
            <p className="mt-4 md:mt-0">&copy; {new Date().getFullYear()} Disha Path. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
