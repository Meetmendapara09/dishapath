// src/app/(app)/colleges/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, Library, Microscope, Search, Wifi, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface College {
  id: string;
  name: string;
  imageUrlId: string;
  courses: string[];
  facilities: string[];
  medium: string;
}

const facilityIcons: { [key: string]: React.ReactElement } = {
  Hostel: <Home className="h-4 w-4" />,
  Library: <Library className="h-4 w-4" />,
  Lab: <Microscope className="h-4 w-4" />,
  Wifi: <Wifi className="h-4 w-4" />,
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColleges() {
      try {
        const querySnapshot = await getDocs(collection(db, 'colleges'));
        const fetchedColleges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
        setColleges(fetchedColleges);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
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
        <h1 className="text-3xl font-headline font-bold">Find Nearby Government Colleges</h1>
        <p className="text-muted-foreground">Search for colleges and explore their programs, facilities, and more.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by college name, city, or course..." className="pl-10" />
      </div>

      {colleges.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Colleges Found</CardTitle>
            <CardDescription>Please add college information to the 'colleges' collection in Firestore.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const { imageUrl, imageHint } = getImage(college.imageUrlId);
            return (
              <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={`Campus of ${college.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{college.name}</CardTitle>
                  <CardDescription>Medium: {college.medium}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Courses Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {college.courses.map((course) => (
                        <Badge key={course} variant="secondary">{course}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Facilities</h4>
                    <div className="flex flex-wrap gap-4">
                      {college.facilities.map((facility) => (
                        <div key={facility} className="flex items-center gap-2 text-muted-foreground">
                          {facilityIcons[facility]}
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
