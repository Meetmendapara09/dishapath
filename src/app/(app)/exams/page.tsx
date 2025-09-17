// src/app/(app)/exams/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Calendar, Target, Loader2 } from "lucide-react";
import Link from "next/link";

interface Exam {
  id: string;
  name: string;
  purpose: string;
  subjects: string[];
  website: string;
  tentativeDate: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExams() {
      try {
        const querySnapshot = await getDocs(collection(db, 'exams'));
        const fetchedExams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
        setExams(fetchedExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

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
        <p className="text-muted-foreground">Information on key entrance exams for after 12th grade.</p>
      </div>

      {exams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Exams Found</CardTitle>
            <CardDescription>Please add exam information to the 'exams' collection in Firestore.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id}>
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
      )}
    </div>
  );
}
