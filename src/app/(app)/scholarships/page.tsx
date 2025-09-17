// src/app/(app)/scholarships/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, School, IndianRupee, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  imageUrlId: string;
  eligibility: string[];
  amount: string;
  deadline: string;
  link: string;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScholarships() {
      try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const fetchedScholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scholarship));
        setScholarships(fetchedScholarships);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, []);

  const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id) ?? { imageUrl: '', imageHint: '' };
  };

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
        <h1 className="text-3xl font-headline font-bold">Find Scholarships</h1>
        <p className="text-muted-foreground">Explore and apply for scholarships to fund your education.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by name, provider, or eligibility..." className="pl-10" />
      </div>
      
      {scholarships.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Scholarships Found</CardTitle>
            <CardDescription>Please add scholarship information to the 'scholarships' collection in Firestore.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship) => {
            const { imageUrl, imageHint } = getImage(scholarship.imageUrlId);
            return (
              <Card key={scholarship.id} className="flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={`Image for ${scholarship.name}`}
                    fill
                    className="object-cover rounded-t-lg"
                    data-ai-hint={imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{scholarship.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1"><School className="h-4 w-4" /> {scholarship.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" />Eligibility</h4>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.eligibility.map((criterion) => (
                        <Badge key={criterion} variant="outline">{criterion}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><IndianRupee className="h-4 w-4 text-accent" />Amount</h4>
                        <p className="text-sm">{scholarship.amount}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" />Deadline</h4>
                        <p className="text-sm">{scholarship.deadline}</p>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                        <Link href={scholarship.link} target="_blank">
                            Learn More & Apply
                        </Link>
                    </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
