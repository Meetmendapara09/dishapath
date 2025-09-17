// src/app/(app)/materials/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCopy, FileText, Link as LinkIcon, Library, Loader2 } from "lucide-react";
import Link from "next/link";

interface Material {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'guides' | 'papers' | 'links';
}

const categoryIcons: { [key: string]: React.ReactElement } = {
  guides: <BookCopy className="h-6 w-6 text-primary" />,
  papers: <FileText className="h-6 w-6 text-primary" />,
  links: <LinkIcon className="h-6 w-6 text-primary" />,
};

const categoryHeadlines = {
    guides: "Study Guides & E-Books",
    papers: "Practice & Sample Papers",
    links: "Important Links"
};

const buttonText: { [key: string]: string } = {
  guides: 'Visit Resource',
  papers: 'Download',
  links: 'Visit Portal',
};

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<{[key: string]: Material[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const querySnapshot = await getDocs(collection(db, 'studyMaterials'));
        const fetchedMaterials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
        
        const groupedData = fetchedMaterials.reduce((acc: {[key: string]: Material[]}, material: Material) => {
          const { category } = material;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(material);
          return acc;
        }, {});

        setMaterials(groupedData);

      } catch (error) {
        console.error("Error fetching study materials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Object.keys(materials);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Library className="text-primary"/> Study Materials & Resources</h1>
        <p className="text-muted-foreground">Your library of essential resources for academic success.</p>
      </div>

      {categories.length === 0 ? (
         <Card>
          <CardHeader>
            <CardTitle>No Materials Found</CardTitle>
            <CardDescription>Please add materials to the 'studyMaterials' collection in Firestore.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        categories.map(category => (
            <section key={category}>
                <h2 className="text-2xl font-bold font-headline mb-4">{categoryHeadlines[category as keyof typeof categoryHeadlines]}</h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${category === 'links' || category === 'papers' ? 'lg:grid-cols-3' : ''} gap-6`}>
                    {materials[category].map((item) => (
                        <Card key={item.id} className="flex flex-col justify-between">
                            <CardHeader className="flex-row gap-4 items-center">
                                {categoryIcons[item.category]}
                                <div>
                                    <CardTitle>{item.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">{item.description}</CardDescription>
                                <Button asChild className="w-full">
                                    <Link href={item.link} target="_blank">
                                        {buttonText[item.category]} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        ))
      )}
    </div>
  );
}
