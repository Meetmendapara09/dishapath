
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
  CheckCircle,
  Target,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

const testimonials = [
  {
    quote: "Lakshya360 cleared all my confusion after 12th grade. I finally understood which course was right for me and found a great government college nearby. It's a game-changer!",
    name: "Priya S.",
    role: "Class 12 Student, Jaipur",
    avatarId: "testimonial-avatar-1"
  },
  {
    quote: "The AI counselor is amazing! It answered all my questions about different entrance exams and helped me create a study plan. I feel much more confident now.",
    name: "Rohan M.",
    role: "Aspiring Engineer, Bangalore",
    avatarId: "testimonial-avatar-2"
  },
  {
    quote: "As a parent, I was worried about my daughter's career choices. Lakshya360 gave us a clear roadmap and helped us explore options we hadn't even considered. Highly recommended!",
    name: "Anjali D.",
    role: "Parent, Mumbai",
    avatarId: "testimonial-avatar-3"
  }
];


export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-students');

  return (
    <div className="flex min-h-dvh flex-col bg-background">
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
                Chart Your Course to a Bright Future.
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-lg text-foreground/80 md:text-xl">
                Lakshya360 is an AI-powered guide designed to help every student in India navigate their educational and career journey with confidence. Discover your perfect path, from 10th grade to your first job.
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
               {heroImage && <Image
                src={heroImage.imageUrl}
                alt="Happy students looking towards the future"
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />}
               <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </div>
        </section>

         {/* Why Choose Us Section */}
        <section className="bg-primary/5 w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <p className="font-semibold text-primary">OUR MISSION</p>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">A Smarter Way to Empower Every Student</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed">
                    We focus on what truly matters: providing accessible, high-quality guidance for all students.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-primary shadow-md border">
                    <Sparkles className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-headline font-bold">AI-Powered Guidance</h3>
                    <p className="text-foreground/80 mt-2">Our advanced AI provides personalized recommendations for courses, colleges, and careers based on your unique profile and aspirations.</p>
                </div>
              </div>
               <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-primary shadow-md border">
                    <Target className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-headline font-bold">Focus on Govt. Colleges</h3>
                    <p className="text-foreground/80 mt-2">We specialize in providing comprehensive information on government colleges, scholarships, and exams across India to ensure equal opportunity.</p>
                </div>
              </div>
               <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-primary shadow-md border">
                    <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-headline font-bold">End-to-End Support</h3>
                    <p className="text-foreground/80 mt-2">From career exploration after 10th grade to finding the right scholarship, we guide you at every step of your educational journey.</p>
                </div>
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
                  Everything you need to make confident decisions about your future, all in one place, completely free.
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
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => {
                            const avatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
                            return (
                                <CarouselItem key={index}>
                                    <div className="text-center p-4">
                                        <Quote className="h-10 w-10 text-accent mx-auto" />
                                        <blockquote className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-foreground">
                                           "{testimonial.quote}"
                                        </blockquote>
                                        <div className="mt-8 flex items-center justify-center gap-4">
                                            {avatar && <Avatar className="h-12 w-12">
                                            <AvatarImage src={avatar.imageUrl} alt={testimonial.name} data-ai-hint={avatar.imageHint} />
                                            <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>}
                                            <div>
                                            <p className="font-semibold text-lg">{testimonial.name}</p>
                                            <p className="text-sm text-foreground/80">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-primary to-accent/80 rounded-2xl p-12 text-center text-primary-foreground shadow-xl">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Build Your Future?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mt-4">
                Take the first step towards a successful career. It's free, secure, and could change your life.
              </p>
              <Button size="lg" variant="secondary" className="mt-8" asChild>
                <Link href="/login">
                  Get Started Now for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-foreground/60">&copy; {new Date().getFullYear()} Lakshya360. All rights reserved.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Navigate</h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/login" className="hover:text-primary">Login</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li><Link href="/careers" className="hover:text-primary">Explore Careers</Link></li>
                <li><Link href="/colleges" className="hover:text-primary">Find Colleges</Link></li>
                <li><Link href="/scholarships" className="hover:text-primary">Scholarships</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

    
