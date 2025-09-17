import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Briefcase, Building, GraduationCap, Microscope, Palette, PenTool, Wrench } from "lucide-react"

const careerData = {
  Science: [
    {
      degree: "B.Sc. in Computer Science",
      icon: <PenTool className="h-5 w-5 text-primary" />,
      paths: ["Software Developer", "Data Analyst", "Cybersecurity Analyst", "AI/ML Engineer"],
      industries: ["IT & Software", "Finance", "Healthcare", "E-commerce"],
      further_study: ["M.Sc. Computer Science", "MCA", "MBA in IT"],
    },
    {
      degree: "B.Sc. in Physics",
      icon: <Microscope className="h-5 w-5 text-primary" />,
      paths: ["Research Scientist", "Data Scientist", "Lab Technician", "Professor"],
      industries: ["Research & Development", "Education", "Aerospace", "Energy Sector"],
      further_study: ["M.Sc. Physics", "Ph.D. in Astrophysics", "B.Ed."],
    },
     {
      degree: "B.Sc. in Biology",
      icon: <Microscope className="h-5 w-5 text-primary" />,
      paths: ["Botanist", "Zoologist", "Environmental Consultant", "Pharmacist"],
      industries: ["Pharmaceuticals", "Agriculture", "Environmental Conservation", "Biotechnology"],
      further_study: ["M.Sc. Biology/Biotechnology", "MBBS (after qualifying NEET)", "Ph.D."],
    },
    {
      degree: "B.Tech in Mechanical Engineering",
      icon: <Wrench className="h-5 w-5 text-primary" />,
      paths: ["Mechanical Engineer", "Robotics Engineer", "Automotive Designer"],
      industries: ["Automobile", "Aerospace", "Manufacturing", "Robotics"],
      further_study: ["M.Tech", "MBA", "Ph.D. in Robotics"],
    },
  ],
  Commerce: [
    {
      degree: "B.Com. (Bachelor of Commerce)",
      icon: <BarChart className="h-5 w-5 text-primary" />,
      paths: ["Accountant", "Financial Analyst", "Tax Consultant", "Bank PO"],
      industries: ["Banking", "Finance", "Audit & Taxation", "Corporate Sector"],
      further_study: ["M.Com", "CA (Chartered Accountancy)", "CS (Company Secretary)", "MBA in Finance"],
    },
    {
      degree: "BBA (Bachelor of Business Administration)",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      paths: ["Marketing Manager", "HR Manager", "Operations Manager", "Entrepreneur"],
      industries: ["Marketing & Sales", "Human Resources", "Management", "Startups"],
      further_study: ["MBA", "PGDM (Post Graduate Diploma in Management)"],
    },
  ],
  Arts: [
    {
      degree: "B.A. in English Literature",
      icon: <PenTool className="h-5 w-5 text-primary" />,
      paths: ["Content Writer", "Editor", "Journalist", "Public Relations Officer"],
      industries: ["Media & Publishing", "Advertising", "Education", "Corporate Communications"],
      further_study: ["M.A. in English", "Mass Communication", "MBA"],
    },
    {
      degree: "B.A. in History",
      icon: <Palette className="h-5 w-5 text-primary" />,
      paths: ["Archaeologist", "Archivist", "Museum Curator", "Civil Services (IAS/IPS)"],
      industries: ["Government Services", "Museums & Heritage Sites", "Tourism", "Research"],
      further_study: ["M.A. in History", "Ph.D.", "Diploma in Museology"],
    },
    {
      degree: "Bachelor of Fine Arts (BFA)",
      icon: <Palette className="h-5 w-5 text-primary" />,
      paths: ["Graphic Designer", "Animator", "UI/UX Designer", "Art Director"],
      industries: ["Advertising", "Media", "Gaming", "Web Design"],
      further_study: ["Master of Fine Arts (MFA)", "Ph.D. in Arts"],
    },
  ],
  Vocational: [
    {
        degree: "Diploma in Web Development",
        icon: <PenTool className="h-5 w-5 text-primary" />,
        paths: ["Front-end Developer", "Back-end Developer", "Full-stack Developer"],
        industries: ["IT & Software", "E-commerce", "Startups"],
        further_study: ["B.Voc in Software Development", "Advanced Certifications"],
    },
    {
        degree: "Diploma in Digital Marketing",
        icon: <BarChart className="h-5 w-5 text-primary" />,
        paths: ["SEO Specialist", "Social Media Manager", "Content Marketer"],
        industries: ["Marketing & Advertising", "E-commerce", "Any business with online presence"],
        further_study: ["Advanced digital marketing certifications", "BBA in Marketing"],
    },
    {
        degree: "ITI in Electrician Trade",
        icon: <Wrench className="h-5 w-5 text-primary" />,
        paths: ["Electrician", "Wireman", "Electronics Technician"],
        industries: ["Construction", "Manufacturing", "Power Sector", "Railways"],
        further_study: ["Diploma in Electrical Engineering (Polytechnic)"],
    },
  ]
};

export default function CareersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Explore Career Paths</h1>
        <p className="text-muted-foreground">Discover where different degrees can take you. Click on a course to see the possibilities.</p>
      </div>
      <Tabs defaultValue="Science" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Science">Science</TabsTrigger>
          <TabsTrigger value="Commerce">Commerce</TabsTrigger>
          <TabsTrigger value="Arts">Arts</TabsTrigger>
          <TabsTrigger value="Vocational">Vocational</TabsTrigger>
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
                                    {course.icon}
                                    {course.degree}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pl-4 border-l-2 border-primary ml-4">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2"><Briefcase className="h-4 w-4" />Career Paths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.paths.map(path => <Badge key={path} variant="secondary">{path}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2"><Building className="h-4 w-4" />Industries</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {course.industries.map(industry => <Badge key={industry} variant="outline">{industry}</Badge>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 mb-2"><GraduationCap className="h-4 w-4" />Further Studies</h4>
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
    </div>
  );
}
