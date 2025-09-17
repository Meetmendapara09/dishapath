import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCopy, FileText, Link as LinkIcon, Library } from "lucide-react";
import Link from "next/link";

const studyMaterials = [
  {
    title: "NCERT E-Books (Class XI & XII)",
    description: "Access all official NCERT textbooks in digital format for free. The primary source for most entrance exams.",
    link: "https://ncert.nic.in/textbook.php",
    icon: <BookCopy className="h-6 w-6 text-primary" />,
    category: "guides",
  },
  {
    title: "Physics Wallah Study Guides",
    description: "Comprehensive open-source notes and guides for Physics, Chemistry, Maths, and Biology.",
    link: "https://www.pw.live/study-material/neet/physics-class-12-notes",
    icon: <BookCopy className="h-6 w-6 text-primary" />,
    category: "guides",
  },
];

const practicePapers = [
    {
        title: "JEE Main Previous Year Papers",
        description: "Practice with official question papers from previous years provided by NTA.",
        link: "https://nta.ac.in/Downloads",
        icon: <FileText className="h-6 w-6 text-primary" />,
        category: "papers",
    },
    {
        title: "NEET Sample Papers",
        description: "Solve sample papers to understand the NEET exam pattern and improve your time management.",
        link: "https://neet.nta.nic.in/sample-question-paper/",
        icon: <FileText className="h-6 w-6 text-primary" />,
        category: "papers",
    },
     {
        title: "CUET Mock Tests",
        description: "Attempt mock tests for CUET to familiarize yourself with the computer-based test format.",
        link: "https://cuet.samarth.ac.in/",
        icon: <FileText className="h-6 w-6 text-primary" />,
        category: "papers",
    }
];

const importantLinks = [
  {
    title: "National Scholarship Portal (NSP)",
    description: "A one-stop platform for applying to various scholarship schemes offered by Union Government, State Governments and UGC.",
    link: "https://scholarships.gov.in/",
    icon: <LinkIcon className="h-6 w-6 text-primary" />,
    category: "links",
  },
  {
    title: "AICTE Internship Portal",
    description: "Find and apply for AI-approved internships from various companies and government agencies.",
    link: "https://internship.aicte-india.org/",
    icon: <LinkIcon className="h-6 w-6 text-primary" />,
    category: "links",
  },
  {
    title: "Swayam Portal",
    description: "An initiative by the Govt. of India for online courses on various subjects from top institutions.",
    link: "https://swayam.gov.in/",
    icon: <LinkIcon className="h-6 w-6 text-primary" />,
    category: "links",
  },
];

export default function StudyMaterialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Library className="text-primary"/> Study Materials & Resources</h1>
        <p className="text-muted-foreground">Your library of essential resources for academic success.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Study Guides & E-Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyMaterials.map((item) => (
                <Card key={item.title} className="flex flex-col justify-between">
                    <CardHeader className="flex-row gap-4 items-center">
                        {item.icon}
                        <div>
                            <CardTitle>{item.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">{item.description}</CardDescription>
                        <Button asChild>
                            <Link href={item.link} target="_blank">
                                Visit Resource <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Practice & Sample Papers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practicePapers.map((item) => (
                <Card key={item.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">{item.icon} {item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">{item.description}</CardDescription>
                         <Button asChild className="w-full">
                            <Link href={item.link} target="_blank">
                                Download <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Important Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importantLinks.map((item) => (
                <Card key={item.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">{item.icon} {item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">{item.description}</CardDescription>
                         <Button asChild className="w-full">
                            <Link href={item.link} target="_blank">
                                Visit Portal <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
