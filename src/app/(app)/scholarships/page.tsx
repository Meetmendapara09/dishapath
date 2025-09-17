// src/app/(app)/scholarships/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
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

// Sample data to display since the database is empty
const sampleScholarships: Scholarship[] = [
  {
    id: 'nmms',
    name: 'National Merit Cum Means Scholarship (NMMS)',
    provider: 'Department of School Education & Literacy, Govt. of India',
    imageUrlId: 'scholarship-1',
    eligibility: ['Class 9 Students', 'Family income < ₹3.5 Lakh'],
    amount: '₹12,000 per annum',
    deadline: 'October - November',
    link: 'https://scholarships.gov.in/',
  },
  {
    id: 'pm-yasasvi',
    name: 'PM YASASVI Central Sector Scheme',
    provider: 'Ministry of Social Justice & Empowerment',
    imageUrlId: 'scholarship-1',
    eligibility: ['Class 9-12 Students', 'OBC, EBC, DNT categories', 'Top Class Schools'],
    amount: 'Up to ₹1,25,000 per annum',
    deadline: 'August - September',
    link: 'https://yet.nta.ac.in/',
  },
  {
    id: 'reliance-foundation-scholarship',
    name: 'Reliance Foundation Undergraduate Scholarships',
    provider: 'Reliance Foundation',
    imageUrlId: 'scholarship-2',
    eligibility: ['1st Year Undergrad Students', 'All Streams', 'Merit-cum-means based'],
    amount: 'Up to ₹2,00,000',
    deadline: 'October',
    link: 'https://www.scholarships.reliancefoundation.org/',
  },
  {
    id: 'tata-trust-scholarship',
    name: 'Tata Trusts Means Grant for College',
    provider: 'Tata Trusts',
    imageUrlId: 'scholarship-4',
    eligibility: ['Undergraduate & Postgraduate', 'Professional courses', 'Merit-based'],
    amount: 'Varies (Tuition fee coverage)',
    deadline: 'Varies (check portal)',
    link: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
  },
  {
    id: 'digital-india',
    name: 'Digital India Internship for NIC',
    provider: 'National Informatics Centre (NIC)',
    imageUrlId: 'scholarship-4',
    eligibility: ['B.E/B.Tech, M.E/M.Tech, MCA', 'At least 75% marks'],
    amount: '₹10,000 per month stipend',
    deadline: 'Varies (check portal)',
    link: 'https://www.nic.in/internship/',
  },
  {
    id: 'scholarship-for-girls',
    name: 'Begum Hazrat Mahal National Scholarship',
    provider: 'Minority Affairs Foundation',
    imageUrlId: 'scholarship-3',
    eligibility: ['Girl Students from minority communities', 'Class 9-12', 'Family income < ₹2 Lakh'],
    amount: 'Up to ₹6,000 per annum',
    deadline: 'September - October',
    link: 'https://scholarships.gov.in/',
  },
  {
    id: 'loreal-scholarship',
    name: 'L\'Oréal India For Young Women In Science Scholarship',
    provider: 'L\'Oréal India',
    imageUrlId: 'scholarship-3',
    eligibility: ['Passed Class 12 (Science)', 'Female students', 'Family income < ₹6 Lakh'],
    amount: 'Up to ₹2,50,000 for graduation',
    deadline: 'Varies (check portal)',
    link: 'https://www.foryoungwomeninscience.com/',
  },
  {
    id: 'colgate-scholarship',
    name: 'Keep India Smiling Foundational Scholarship',
    provider: 'Colgate-Palmolive (India) Ltd.',
    imageUrlId: 'scholarship-2',
    eligibility: ['Class 11, Diploma, UG, Sportsperson', 'Family income < ₹5 Lakh'],
    amount: 'Up to ₹30,000 per year for 3 years',
    deadline: 'Varies (check portal)',
    link: 'https://www.colgate.com/en-in/smile-karo-aur-shuru-ho-jao/keep-india-smiling',
  },
];


export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(sampleScholarships);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /*
  // This code will fetch from Firestore. Uncomment it when you have data in the 'scholarships' collection.
  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const fetchedScholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scholarship));
        if (fetchedScholarships.length > 0) {
            setScholarships(fetchedScholarships);
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setLoading(false);
      }
    }
    // fetchScholarships(); // Uncomment to fetch from Firestore
  }, []);
  */

  const filteredScholarships = useMemo(() => {
    if (!searchQuery) {
      return scholarships;
    }
    return scholarships.filter(scholarship => {
      const searchLower = searchQuery.toLowerCase();
      return (
        scholarship.name.toLowerCase().includes(searchLower) ||
        scholarship.provider.toLowerCase().includes(searchLower) ||
        scholarship.eligibility.some(e => e.toLowerCase().includes(searchLower))
      );
    });
  }, [searchQuery, scholarships]);

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
        <Input 
          placeholder="Search by name, provider, or eligibility..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      
      {scholarships.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Scholarships Found</CardTitle>
            <CardDescription>Please add scholarship information to the 'scholarships' collection in Firestore.</CardDescription>
          </CardHeader>
        </Card>
      ) : filteredScholarships.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Scholarships Found for "{searchQuery}"</CardTitle>
            <CardDescription>Try a different search term.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => {
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
