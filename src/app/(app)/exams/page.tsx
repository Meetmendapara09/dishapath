import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Target } from "lucide-react";
import Link from "next/link";

const exams = [
  {
    name: "JEE (Joint Entrance Examination)",
    purpose: "Engineering admissions",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    website: "https://jeemain.nta.nic.in/",
    tentativeDate: "January & April"
  },
  {
    name: "NEET (National Eligibility cum Entrance Test)",
    purpose: "Medical and dental admissions",
    subjects: ["Physics", "Chemistry", "Biology"],
    website: "https://neet.nta.nic.in/",
    tentativeDate: "May"
  },
  {
    name: "CUET (Common University Entrance Test)",
    purpose: "Admission to various central universities",
    subjects: ["Varies based on course"],
    website: "https://cuet.samarth.ac.in/",
    tentativeDate: "May"
  },
  {
    name: "CLAT (Common Law Admission Test)",
    purpose: "Law school admissions",
    subjects: ["English", "General Knowledge", "Legal Aptitude", "Logical Reasoning"],
    website: "https://consortiumofnlus.ac.in/clat-2025/",
    tentativeDate: "December"
  },
];

export default function ExamsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Entrance Exams</h1>
        <p className="text-muted-foreground">Information on key entrance exams for after 12th grade.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <Card key={exam.name}>
            <CardHeader>
              <CardTitle>{exam.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1"><Target className="h-4 w-4" /> {exam.purpose}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2"><Book className="h-4 w-4" />Key Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {exam.subjects.map(subject => <Badge key={subject} variant="secondary">{subject}</Badge>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2"><Calendar className="h-4 w-4" />Tentative Date</h4>
                <p className="text-sm text-muted-foreground">{exam.tentativeDate}</p>
              </div>
              <Button asChild className="w-full md:w-auto">
                <Link href={exam.website} target="_blank">
                  Visit Official Website <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
