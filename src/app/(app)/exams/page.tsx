// src/app/(app)/exams/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Exam {
  id: string;
  name: string;
  purpose: string;
  subjects: string[];
  website: string;
  tentativeDate: string;
  level: 'After 12th' | 'After 10th';
  field: string;
}

// Sample data to display since the database is empty
const sampleExams: Exam[] = [
    {
        id: 'jee-main',
        name: 'JEE Main',
        purpose: 'Engineering Entrance (NITs, IIITs, GFTIs)',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        website: 'https://jeemain.nta.nic.in/',
        tentativeDate: 'January & April',
        level: 'After 12th',
        field: 'Engineering'
    },
    {
        id: 'jee-advanced',
        name: 'JEE Advanced',
        purpose: 'Engineering Entrance (IITs)',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        website: 'https://jeeadv.ac.in/',
        tentativeDate: 'May - June',
        level: 'After 12th',
        field: 'Engineering'
    },
    {
        id: 'neet',
        name: 'NEET (UG)',
        purpose: 'Medical & Dental Entrance (MBBS, BDS, AYUSH)',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        website: 'https://neet.nta.nic.in/',
        tentativeDate: 'May',
        level: 'After 12th',
        field: 'Medical'
    },
     {
        id: 'cuet',
        name: 'CUET (UG)',
        purpose: 'Central, State, & Private University Entrance',
        subjects: ['Varies by Course & University'],
        website: 'https://cuet.samarth.ac.in/',
        tentativeDate: 'May - June',
        level: 'After 12th',
        field: 'General'
    },
    {
        id: 'clat',
        name: 'CLAT',
        purpose: 'Law Entrance (22+ National Law Universities)',
        subjects: ['English', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques', 'Current Affairs'],
        website: 'https://consortiumofnlus.ac.in/',
        tentativeDate: 'December',
        level: 'After 12th',
        field: 'Law'
    },
    {
        id: 'ailet',
        name: 'AILET',
        purpose: 'Law Entrance (NLU Delhi)',
        subjects: ['English', 'Logical Reasoning', 'General Knowledge'],
        website: 'https://nationallawuniversitydelhi.in/',
        tentativeDate: 'December',
        level: 'After 12th',
        field: 'Law'
    },
    {
        id: 'lsat-india',
        name: 'LSAT—India',
        purpose: 'Law Entrance (Jindal, BML Munjal, etc.)',
        subjects: ['Analytical Reasoning', 'Logical Reasoning', 'Reading Comprehension'],
        website: 'https://www.lsac.org/lsat-india',
        tentativeDate: 'January & May',
        level: 'After 12th',
        field: 'Law'
    },
    {
        id: 'slat',
        name: 'SLAT',
        purpose: 'Law Entrance (Symbiosis Law Schools)',
        subjects: ['Logical Reasoning', 'Legal Reasoning', 'Analytical Reasoning', 'Reading Comprehension', 'GK'],
        website: 'https://www.set-test.org/',
        tentativeDate: 'May',
        level: 'After 12th',
        field: 'Law'
    },
    {
        id: 'nchmct-jee',
        name: 'NCHMCT JEE',
        purpose: 'Hotel Management & Catering Technology',
        subjects: ['Numerical Ability', 'Aptitude', 'Reasoning', 'English', 'General Knowledge'],
        website: 'https://nchmjee.nta.nic.in/',
        tentativeDate: 'May',
        level: 'After 12th',
        field: 'Hospitality'
    },
    {
        id: 'nid-dat',
        name: 'NID DAT',
        purpose: 'Design Entrance (National Institute of Design)',
        subjects: ['Creative Ability Test', 'Studio Test'],
        website: 'https://admissions.nid.edu/',
        tentativeDate: 'December - January',
        level: 'After 12th',
        field: 'Design'
    },
    {
        id: 'nift',
        name: 'NIFT Entrance Exam',
        purpose: 'Fashion Technology & Design (NIFT)',
        subjects: ['Creative Ability', 'General Ability', 'Situation Test'],
        website: 'https://www.nift.ac.in/admission',
        tentativeDate: 'February',
        level: 'After 12th',
        field: 'Design'
    },
    {
        id: 'uceed',
        name: 'UCEED',
        purpose: 'Undergraduate Design Entrance (IITs, IIITDM)',
        subjects: ['Visualization', 'Observation', 'Design thinking', 'Logical Reasoning'],
        website: 'https://www.uceed.iitb.ac.in/',
        tentativeDate: 'January',
        level: 'After 12th',
        field: 'Design'
    },
    {
        id: 'ca-foundation',
        name: 'CA Foundation',
        purpose: 'Chartered Accountancy First Level',
        subjects: ['Accounting', 'Business Laws', 'Mathematics & Statistics', 'Business Economics'],
        website: 'https://www.icai.org/',
        tentativeDate: 'June & December',
        level: 'After 12th',
        field: 'Commerce'
    },
    {
        id: 'cs-foundation',
        name: 'CS Foundation (CSEET)',
        purpose: 'Company Secretary Entrance Test',
        subjects: ['Business Communication', 'Legal Aptitude', 'Economic & Business Environment', 'Current Affairs'],
        website: 'https://www.icsi.edu/',
        tentativeDate: 'Jan, May, July, Nov',
        level: 'After 12th',
        field: 'Commerce'
    },
    {
        id: 'cma-foundation',
        name: 'CMA Foundation',
        purpose: 'Cost & Management Accountancy First Level',
        subjects: ['Economics & Management', 'Accounting', 'Laws & Ethics', 'Business Mathematics & Statistics'],
        website: 'https://icmai.in/',
        tentativeDate: 'June & December',
        level: 'After 12th',
        field: 'Commerce'
    },
    {
        id: 'npat',
        name: 'NPAT',
        purpose: 'UG Admission (BBA, B.Com, etc.) for NMIMS',
        subjects: ['Quantitative', 'Reasoning', 'English'],
        website: 'https://www.nmimsnpat.in/',
        tentativeDate: 'January - May',
        level: 'After 12th',
        field: 'Commerce'
    },
    {
        id: 'set',
        name: 'SET',
        purpose: 'UG Admission (BBA, BCA, etc.) for Symbiosis',
        subjects: ['General English', 'Quantitative', 'General Awareness', 'Analytical & Logical Reasoning'],
        website: 'https://www.set-test.org/',
        tentativeDate: 'May',
        level: 'After 12th',
        field: 'Commerce'
    },
    {
        id: 'iiser-iat',
        name: 'IISER Aptitude Test (IAT)',
        purpose: 'Science UG Admissions (IISERs)',
        subjects: ['Physics', 'Chemistry', 'Maths', 'Biology'],
        website: 'https://www.iiseradmission.in/',
        tentativeDate: 'June',
        level: 'After 12th',
        field: 'Science'
    },
    {
        id: 'nest',
        name: 'NEST',
        purpose: 'Integrated M.Sc in Science (NISER, CEBS)',
        subjects: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
        website: 'https://www.nestexam.in/',
        tentativeDate: 'June',
        level: 'After 12th',
        field: 'Science'
    },
    {
        id: 'bitsat',
        name: 'BITSAT',
        purpose: 'Engineering & Pharmacy (BITS Pilani Campuses)',
        subjects: ['Physics', 'Chemistry', 'Maths/Biology', 'English', 'Logical Reasoning'],
        website: 'https://www.bitsadmission.com/',
        tentativeDate: 'May & June',
        level: 'After 12th',
        field: 'Engineering'
    },
    {
        id: 'viteee',
        name: 'VITEEE',
        purpose: 'Engineering Entrance (VIT Campuses)',
        subjects: ['Physics', 'Chemistry', 'Maths/Biology', 'English', 'Aptitude'],
        website: 'https://viteee.vit.ac.in/',
        tentativeDate: 'April',
        level: 'After 12th',
        field: 'Engineering'
    },
    {
        id: 'srmjee',
        name: 'SRMJEEE',
        purpose: 'Engineering Entrance (SRM Campuses)',
        subjects: ['Physics', 'Chemistry', 'Maths/Biology', 'English', 'Aptitude'],
        website: 'https://www.srmist.edu.in/admission-india/',
        tentativeDate: 'April, June, July',
        level: 'After 12th',
        field: 'Engineering'
    },
    {
        id: 'ntse',
        name: 'NTSE',
        purpose: 'Scholarship Exam for High-Achieving Students',
        subjects: ['Mental Ability', 'Scholastic Aptitude (Maths, Science, Social Science)'],
        website: 'https://ncert.nic.in/ntse.php',
        tentativeDate: 'On Hold',
        level: 'After 10th',
        field: 'General'
    },
];

const examFields = ['All', ...Array.from(new Set(sampleExams.map(e => e.field)))];

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(sampleExams);
  const [loading, setLoading] = useState(false);
  const [levelFilter, setLevelFilter] = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All');


  /*
  // This code will fetch from Firestore. Uncomment it when you have data in the 'exams' collection.
  useEffect(() => {
    async function fetchExams() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'exams'));
        const fetchedExams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
        if (fetchedExams.length > 0) {
          setExams(fetchedExams);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    }
    // fetchExams(); // Uncomment this line to fetch from Firestore
  }, []);
  */
  
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
        const levelMatch = levelFilter === 'All' || exam.level === levelFilter;
        const fieldMatch = fieldFilter === 'All' || exam.field === fieldFilter;
        return levelMatch && fieldMatch;
    });
  }, [exams, levelFilter, fieldFilter]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Entrance Exams</h1>
        <p className="text-muted-foreground">Information on key entrance exams for after 10th and 12th grade.</p>
      </div>

       <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
             <Tabs value={levelFilter} onValueChange={setLevelFilter} className="w-full sm:w-auto">
                <TabsList>
                    <TabsTrigger value="All">All Levels</TabsTrigger>
                    <TabsTrigger value="After 12th">After 12th</TabsTrigger>
                    <TabsTrigger value="After 10th">After 10th</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
         <Tabs value={fieldFilter} onValueChange={setFieldFilter} className="w-full">
            <TabsList className="flex flex-wrap h-auto">
                {examFields.sort().map(field => (
                    <TabsTrigger key={field} value={field}>{field}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
      </div>

      {filteredExams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Exams Found</CardTitle>
            <CardDescription>
                {exams.length > 0 
                ? "Your current filter selection returned no results. Try a different filter."
                : "Please add exam information to the 'exams' collection in Firestore."
                }
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{exam.name}</CardTitle>
                    <Badge variant={exam.level === 'After 10th' ? 'destructive' : 'default'}>{exam.level}</Badge>
                </div>
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
      )}
    </div>
  );
}

    