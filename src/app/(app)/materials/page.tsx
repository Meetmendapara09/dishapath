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

const sampleMaterials: Material[] = [
    // Important Links
    {
        id: 'ndl',
        title: 'National Digital Library of India',
        description: 'A vast repository of e-books, articles, videos, and more from various educational institutions, supported by the Ministry of Education.',
        link: 'https://ndl.iitkgp.ac.in/',
        category: 'links'
    },
    {
        id: 'acm-dl',
        title: 'ACM Digital Library',
        description: 'A comprehensive collection of full-text articles and papers from the Association for Computing Machinery, essential for engineering students.',
        link: 'https://dl.acm.org/',
        category: 'links'
    },
    {
        id: 'pubmed',
        title: 'PubMed Central (PMC)',
        description: 'A free full-text archive of biomedical and life sciences journal literature at the U.S. National Institutes of Health\'s National Library of Medicine.',
        link: 'https://www.ncbi.nlm.nih.gov/pmc/',
        category: 'links'
    },

    // Study Guides
    {
        id: 'const-india',
        title: 'Constitution of India',
        description: 'The complete text of the Constitution of India, an essential resource for students of law, political science, and for civil services preparation.',
        link: 'https://www.india.gov.in/my-government/constitution-india/constitution-india-full-text',
        category: 'guides'
    },
    {
        id: 'ncert-books',
        title: 'NCERT E-Books (Class I-XII)',
        description: 'Official NCERT textbooks, which form the foundation for many competitive exams like JEE, NEET, and UPSC.',
        link: 'https://ncert.nic.in/textbook.php',
        category: 'guides'
    },

    // Practice Papers
    {
        id: 'jee-main-papers',
        title: 'JEE Main Previous Year Papers',
        description: 'Official question papers from previous years of the Joint Entrance Examination (Main) for engineering aspirants.',
        link: 'https://jeemain.nta.nic.in/previous-year-question-papers/',
        category: 'papers'
    },
    {
        id: 'neet-papers',
        title: 'NEET (UG) Previous Year Papers',
        description: 'Past question papers for the National Eligibility cum Entrance Test for medical and dental college aspirants.',
        link: 'https://neet.nta.nic.in/question-papers/',
        category: 'papers'
    },
    {
        id: 'cuet-papers',
        title: 'CUET (UG) Practice Papers',
        description: 'Sample papers for the Common University Entrance Test, used for admission to various undergraduate programs.',
        link: 'https://cuet.samarth.ac.in/index.php/site/syllabus',
        category: 'papers'
    },
];

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
  guides: 'Read Now',
  papers: 'View Papers',
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
        
        let materialsToGroup = fetchedMaterials.length > 0 ? fetchedMaterials : sampleMaterials;
        
        const groupedData = materialsToGroup.reduce((acc: {[key: string]: Material[]}, material: Material) => {
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
         // Fallback to sample data on error
        const groupedData = sampleMaterials.reduce((acc: {[key: string]: Material[]}, material: Material) => {
          const { category } = material;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(material);
          return acc;
        }, {});
        setMaterials(groupedData);
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

  const categories = Object.keys(materials).sort((a,b) => {
    const order = ['links', 'guides', 'papers'];
    return order.indexOf(a) - order.indexOf(b);
  });

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
            <CardDescription>Please add materials to the 'studyMaterials' collection in Firestore or check sample data.</CardDescription>
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
                                        {buttonText[item.category as keyof typeof buttonText]} <ArrowRight className="ml-2 h-4 w-4" />
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
