// src/app/(app)/careers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Briefcase, Building, GraduationCap, Microscope, Palette, PenTool, Wrench, Loader2, Sparkles, Wand2, Code } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { generateDayInLifeStory, DayInLifeStoryOutput } from '@/ai/flows/day-in-a-life-story-generator';
import { useToast } from '@/hooks/use-toast';


interface Course {
  degree: string;
  iconName: string;
  paths: string[];
  industries: string[];
  further_study: string[];
  stream: string;
}

interface CareerData {
  [key: string]: Course[];
}

const sampleCareers: Course[] = [
  // Science Stream
  {
    stream: "Science",
    degree: "B.Tech in Computer Science",
    iconName: "Code",
    paths: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst", "AI/ML Engineer"],
    industries: ["IT Services", "Finance", "Healthcare", "E-commerce"],
    further_study: ["M.Tech", "MBA", "PhD"]
  },
  {
    stream: "Science",
    degree: "B.Tech in Mechanical Engineering",
    iconName: "Wrench",
    paths: ["Mechanical Engineer", "Automotive Designer", "Aerospace Engineer", "Robotics Engineer"],
    industries: ["Manufacturing", "Automobile", "Aerospace", "Energy"],
    further_study: ["M.Tech", "MS in Robotics", "MBA"]
  },
  {
    stream: "Science",
    degree: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    iconName: "Microscope",
    paths: ["Doctor (General Physician)", "Surgeon", "Specialist (e.g., Cardiologist)", "Medical Researcher"],
    industries: ["Hospitals", "Private Practice", "Research Institutes", "Public Health"],
    further_study: ["MD (Doctor of Medicine)", "MS (Master of Surgery)"]
  },
  {
    stream: "Science",
    degree: "Bachelor of Architecture (B.Arch)",
    iconName: "PenTool",
    paths: ["Architect", "Urban Planner", "Interior Designer", "Landscape Architect"],
    industries: ["Construction", "Real Estate", "Urban Planning", "Interior Design"],
    further_study: ["M.Arch", "Master's in Urban Planning"]
  },
   {
    stream: "Science",
    degree: "Bachelor of Pharmacy (B.Pharm)",
    iconName: "Microscope",
    paths: ["Pharmacist", "Clinical Researcher", "Drug Inspector", "Medical Representative"],
    industries: ["Pharmaceuticals", "Healthcare", "Research", "Regulatory Bodies"],
    further_study: ["M.Pharm", "Pharm.D", "MBA"]
  },
  {
    stream: "Science",
    degree: "B.Sc in Physics",
    iconName: "Microscope",
    paths: ["Research Scientist", "Data Analyst", "Lab Technician", "Science Journalist"],
    industries: ["Research (ISRO, DRDO)", "Education", "IT", "Media"],
    further_study: ["M.Sc in Physics", "PhD", "B.Ed"]
  },
  // Commerce Stream
  {
    stream: "Commerce",
    degree: "Bachelor of Commerce (B.Com)",
    iconName: "BarChart",
    paths: ["Accountant", "Financial Analyst", "Tax Consultant", "Auditor"],
    industries: ["Banking", "Finance", "Consulting", "FMCG"],
    further_study: ["CA (Chartered Accountancy)", "MBA in Finance", "M.Com"]
  },
  {
    stream: "Commerce",
    degree: "Bachelor of Business Administration (BBA)",
    iconName: "Briefcase",
    paths: ["Marketing Manager", "HR Manager", "Operations Head", "Entrepreneur"],
    industries: ["Retail", "Marketing & Advertising", "IT", "Startups"],
    further_study: ["MBA", "PGDM", "Master's in Management"]
  },
   {
    stream: "Commerce",
    degree: "BBA LLB (Integrated Law)",
    iconName: "Briefcase",
    paths: ["Corporate Lawyer", "Legal Advisor", "Litigation Lawyer", "Compliance Officer"],
    industries: ["Law Firms", "Corporate Legal Depts.", "Consulting", "Government"],
    further_study: ["LLM", "MBA"]
  },
  // Arts Stream
  {
    stream: "Arts",
    degree: "B.A. in English Literature",
    iconName: "PenTool",
    paths: ["Content Writer", "Editor", "Journalist", "Public Relations Officer"],
    industries: ["Media & Publishing", "Advertising", "Corporate Communications", "Education"],
    further_study: ["M.A. in English", "Mass Communication", "PhD"]
  },
  {
    stream: "Arts",
    degree: "Bachelor of Fine Arts (BFA)",
    iconName: "Palette",
    paths: ["Graphic Designer", "Illustrator", "Animator", "Art Director"],
    industries: ["Advertising", "Media & Entertainment", "Gaming", "Fashion"],
    further_study: ["Master of Fine Arts (MFA)", "PG Diploma in Design"]
  },
  {
    stream: "Arts",
    degree: "Bachelor of Design (B.Des)",
    iconName: "Palette",
    paths: ["UI/UX Designer", "Product Designer", "Fashion Designer", "Automobile Designer"],
    industries: ["IT/Software", "Product Design", "Fashion", "Automobile"],
    further_study: ["M.Des", "MBA in Design Management"]
  },
   {
    stream: "Arts",
    degree: "B.A. in Economics",
    iconName: "BarChart",
    paths: ["Economist", "Data Analyst", "Financial Consultant", "Policy Analyst"],
    industries: ["Banking & Finance", "Consulting", "Research", "Government"],
    further_study: ["M.A. in Economics", "MBA", "M.Sc in Data Science"]
  },
   {
    stream: "Arts",
    degree: "B.A. in Political Science",
    iconName: "PenTool",
    paths: ["Policy Analyst", "Civil Servant (IAS, IPS)", "Legislative Assistant", "Political Consultant"],
    industries: ["Government", "NGOs", "Think Tanks", "Media"],
    further_study: ["M.A. in Political Science", "Master's in Public Policy", "LLB"]
  }
];


const iconComponents: { [key: string]: React.ElementType } = {
  PenTool,
  Microscope,
  Wrench,
  BarChart,
  Briefcase,
  Palette,
  Code
};

export default function CareersPage() {
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyContent, setStoryContent] = useState<DayInLifeStoryOutput | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCareers() {
      try {
        // const querySnapshot = await getDocs(collection(db, 'careers'));
        // const fetchedCareers: Course[] = querySnapshot.docs.map(doc => doc.data() as Course);
        const fetchedCareers = sampleCareers;
        
        const groupedData = fetchedCareers.reduce((acc: CareerData, course: Course) => {
          const { stream } = course;
          if (!acc[stream]) {
            acc[stream] = [];
          }
          acc[stream].push(course);
          return acc;
        }, {});

        setCareerData(groupedData);

      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  const handleGenerateStory = async (career: string) => {
    setSelectedCareer(career);
    setStoryModalOpen(true);
    setStoryLoading(true);
    setStoryContent(null);

    try {
      const result = await generateDayInLifeStory({ career });
      setStoryContent(result);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate the story. Please try again.',
      });
      setStoryModalOpen(false);
    } finally {
      setStoryLoading(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const Icon = iconComponents[iconName];
    return Icon ? <Icon className="h-5 w-5 text-primary" /> : <Briefcase className="h-5 w-5 text-primary" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!careerData || Object.keys(careerData).length === 0) {
     return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Explore Career Paths</h1>
          <p className="text-muted-foreground">Discover where different degrees can take you. Click on a course to see the possibilities.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Career Data Found</CardTitle>
            <CardDescription>Please add career information to the 'careers' collection in Firestore or add sample data to the page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const streams = Object.keys(careerData);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Explore Career Paths</h1>
        <p className="text-muted-foreground">Discover where different degrees can take you. Click on a course to see the possibilities.</p>
      </div>
      <Tabs defaultValue={streams[0]} className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start">
          {streams.map(stream => (
            <TabsTrigger key={stream} value={stream}>{stream}</TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(careerData).map(([stream, courses]) => (
          <TabsContent key={stream} value={stream}>
            <Card>
                <CardHeader>
                    <CardTitle>{stream} Stream</CardTitle>
                    <CardDescription>Potential career paths for degrees in the {stream.toLowerCase()} stream.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {courses.map((course, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                                <div className="flex items-center gap-3">
                                    {renderIcon(course.iconName)}
                                    {course.degree}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pl-4 border-l-2 border-primary ml-4">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2"><Briefcase className="h-4 w-4" />Career Paths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.paths.map(path => (
                                              <div key={path} className="flex flex-col items-center gap-2">
                                                <Badge variant="secondary" className="text-base px-3 py-1">{path}</Badge>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleGenerateStory(path)}>
                                                  <Wand2 className="h-3 w-3 mr-1"/> A Day in the Life
                                                </Button>
                                              </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2 mt-4"><Building className="h-4 w-4" />Industries</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.industries.map(industry => <Badge key={industry} variant="outline">{industry}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2 mt-4"><GraduationCap className="h-4 w-4" />Further Studies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.further_study.map(study => <Badge key={study} variant="default" className="bg-primary/80">{study}</Badge>)}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={storyModalOpen} onOpenChange={setStoryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Sparkles className="h-6 w-6 text-accent" /> A Day in the Life of a {selectedCareer}
            </DialogTitle>
            <DialogDescription>
              Step into the shoes of a {selectedCareer} for a day. Here's a glimpse of what your future could look like.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-h-[60vh] overflow-y-auto pr-4">
            {storyLoading ? (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-semibold">Our AI storyteller is writing...</p>
                  <p className="text-muted-foreground">Please wait a moment.</p>
              </div>
            ) : storyContent ? (
              <>
                <h3 className="text-xl font-bold">{storyContent.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: storyContent.story.replace(/\n/g, '<br />') }} />
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
