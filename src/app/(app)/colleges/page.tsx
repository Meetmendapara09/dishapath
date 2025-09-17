// src/app/(app)/colleges/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, Library, Microscope, Search, Wifi, Loader2, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDebounce } from '@/hooks/use-debounce';
import { findCollegesFlow, FindCollegesOutput } from '@/ai/flows/find-colleges-flow';
import { useToast } from '@/hooks/use-toast';

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
  const [initialColleges, setInitialColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<FindCollegesOutput['colleges'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSummary, setSearchSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchColleges() {
      try {
        const querySnapshot = await getDocs(collection(db, 'colleges'));
        const fetchedColleges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
        setInitialColleges(fetchedColleges);
      } catch (error) {
        console.error("Error fetching colleges:", error);
         toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load initial college list.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, [toast]);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setFilteredColleges(null);
      setSearchSummary('');
      return;
    }
    setIsSearching(true);
    setSearchSummary('');
    try {
      const result = await findCollegesFlow({ query });
      setFilteredColleges(result.colleges);
      setSearchSummary(result.summary);
    } catch (error) {
      console.error("Error during AI search:", error);
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: 'The AI search failed. Please try a simpler query.',
      });
      setFilteredColleges([]); // Show no results on error
      setSearchSummary('An error occurred during the search.');
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, handleSearch]);

  const getImage = (name: string) => {
    // Create a semi-stable mapping from name to an image ID to avoid random images on each search
    const imageIds = PlaceHolderImages.filter(p => p.id.startsWith('college-')).map(p => p.id);
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageId = imageIds[hash % imageIds.length] || 'college-1';
    return PlaceHolderImages.find(img => img.id === imageId) ?? { imageUrl: '', imageHint: '' };
  };
  
  const collegesToDisplay = filteredColleges !== null ? filteredColleges : initialColleges.map(c => ({...c}));


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
        <p className="text-muted-foreground">Use natural language to search for colleges. Try "colleges in Delhi with B.Sc" or "show me colleges with a hostel".</p>
      </div>

      <div className="relative">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
        <Input 
          placeholder="Search with AI..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
      </div>
      
      {searchSummary && (
         <Card className="bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent"/> AI Search Results
            </CardTitle>
            <CardDescription>{searchSummary}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {collegesToDisplay.length === 0 && !isSearching ? (
        <Card>
          <CardHeader>
            <CardTitle>No Colleges Found</CardTitle>
            <CardDescription>
              {filteredColleges !== null 
                ? "Your search returned no results. Try being more general." 
                : "Please add college information to the 'colleges' collection in Firestore."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collegesToDisplay.map((college) => {
            const { imageUrl, imageHint } = getImage(college.name);
            return (
              <Card key={college.name} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                          {facilityIcons[facility] || <div className="h-4 w-4" />}
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
