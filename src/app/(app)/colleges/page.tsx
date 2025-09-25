// src/app/(app)/colleges/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, Library, Microscope, Wifi, Loader2, Sparkles, Bookmark } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { findCollegesFlow, FindCollegesOutput } from '@/ai/flows/find-colleges-flow';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

interface College {
  id?: string;
  name: string;
  medium: string;
  courses?: string[];
  facilities?: string[];
  location?: string;
}

import { cn } from '@/lib/utils';

const sampleColleges: College[] = [
    // IITs
    { id: 'iit-jodhpur', name: 'Indian Institute of Technology, Jodhpur', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-tirupati', name: 'Indian Institute of Technology, Tirupati', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-guwahati', name: 'Indian Institute of Technology, Guwahati', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-patna', name: 'Indian Institute of Technology, Patna', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-bhilai', name: 'Indian Institute of Technology, Bhilai', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-delhi', name: 'Indian Institute of Technology, Delhi', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-goa', name: 'Indian Institute of Technology, Goa', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-gandhinagar', name: 'Indian Institute of Technology, Gandhinagar', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-mandi', name: 'Indian Institute of Technology, Mandi', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-jammu', name: 'Indian Institute of Technology, Jammu', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-dhanbad', name: 'Indian Institute of Technology (ISM), Dhanbad', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-dharwad', name: 'Indian Institute of Technology, Dharwad', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-palakkad', name: 'Indian Institute of Technology, Palakkad', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-indore', name: 'Indian Institute of Technology, Indore', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-bombay', name: 'Indian Institute of Technology, Bombay', courses: ['B.Tech', 'B.Des', 'M.Sc'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-bhubaneswar', name: 'Indian Institute of Technology, Bhubaneswar', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-hyderabad', name: 'Indian Institute of Technology, Hyderabad', courses: ['B.Tech', 'MS by Research', 'Ph.D'], facilities: ['Hostel', 'Library', 'Wifi'], medium: 'English' },
    { id: 'iit-ropar', name: 'Indian Institute of Technology, Ropar', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-madras', name: 'Indian Institute of Technology, Madras', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-kanpur', name: 'Indian Institute of Technology, Kanpur', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-bhu', name: 'Indian Institute of Technology (BHU), Varanasi', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-roorkee', name: 'Indian Institute of Technology, Roorkee', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },
    { id: 'iit-kharagpur', name: 'Indian Institute of Technology, Kharagpur', courses: ['B.Tech', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab', 'Wifi'], medium: 'English' },

    // NITs
    { id: 'nit-trichy', name: 'National Institute of Technology, Tiruchirappalli', courses: ['B.Tech', 'B.Arch', 'M.Tech'], facilities: ['Hostel', 'Library', 'Sports'], medium: 'English' },
    { id: 'nit-surathkal', name: 'National Institute of Technology, Surathkal', courses: ['B.Tech', 'M.Tech', 'MCA'], facilities: ['Hostel', 'Library', 'Beach'], medium: 'English' },
    { id: 'nit-warangal', name: 'National Institute of Technology, Warangal', courses: ['B.Tech', 'M.Sc', 'MBA'], facilities: ['Hostel', 'Library', 'Gym'], medium: 'English' },
    { id: 'nit-rourkela', name: 'National Institute of Technology, Rourkela', courses: ['B.Tech', 'Integrated M.Sc', 'Ph.D'], facilities: ['Hostel', 'Library', 'Pool'], medium: 'English' },
    { id: 'nit-calicut', name: 'National Institute of Technology, Calicut', courses: ['B.Tech', 'B.Arch', 'MBA'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },

    // IIITs
    { id: 'iiit-allahabad', name: 'Indian Institute of Information Technology, Allahabad', courses: ['B.Tech (IT)', 'B.Tech (EC)', 'MBA'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
    { id: 'iiit-gwalior', name: 'Indian Institute of Information Technology and Management, Gwalior', courses: ['IPG (B.Tech+M.Tech)', 'IPG (B.Tech+MBA)'], facilities: ['Hostel', 'Library', 'Sports'], medium: 'English' },
    { id: 'iiit-lucknow', name: 'Indian Institute of Information Technology, Lucknow', courses: ['B.Tech (CS)', 'B.Tech (AI)'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },

    // AIIMS
    { id: 'aiims-delhi', name: 'All India Institute of Medical Sciences, Delhi', courses: ['MBBS', 'B.Sc (Hons)', 'MD/MS'], facilities: ['Hostel', 'Library', 'Hospital'], medium: 'English' },
    { id: 'aiims-bhopal', name: 'All India Institute of Medical Sciences, Bhopal', courses: ['MBBS', 'B.Sc (Nursing)'], facilities: ['Hostel', 'Library', 'Hospital'], medium: 'English' },
    { id: 'aiims-jodhpur', name: 'All India Institute of Medical Sciences, Jodhpur', courses: ['MBBS', 'MD/MS'], facilities: ['Hostel', 'Library', 'Hospital'], medium: 'English' },

    // Others
    { id: 'iisc-bangalore', name: 'Indian Institute of Science, Bangalore', courses: ['B.S. (Research)', 'M.Tech', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
    { id: 'isi-kolkata', name: 'Indian Statistical Institute, Kolkata', courses: ['B.Stat', 'B.Math', 'M.S.'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
    { id: 'niser-bhubaneswar', name: 'National Institute of Science Education and Research, Bhubaneswar', courses: ['Integrated M.Sc'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
    { id: 'iiser-pune', name: 'Indian Institute of Science Education and Research, Pune', courses: ['BS-MS Dual Degree', 'Ph.D'], facilities: ['Hostel', 'Library', 'Lab'], medium: 'English' },
];

const facilityIcons: { [key: string]: React.ReactElement } = {
  Hostel: <Home className="h-4 w-4" />,
  Library: <Library className="h-4 w-4" />,
  Lab: <Microscope className="h-4 w-4" />,
  Wifi: <Wifi className="h-4 w-4" />,
  Hospital: <Badge>Hospital</Badge>,
  Sports: <Badge>Sports</Badge>,
  Beach: <Badge>Beach</Badge>,
  Gym: <Badge>Gym</Badge>,
  Pool: <Badge>Pool</Badge>,
};

export default function CollegesPage() {
  const { user } = useAuth();
  const [initialColleges, setInitialColleges] = useState<College[]>(sampleColleges);
  const [filteredColleges, setFilteredColleges] = useState<FindCollegesOutput['colleges'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSummary, setSearchSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarkedColleges, setBookmarkedColleges] = useState<string[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { toast } = useToast();

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const collegesSnapshot = await getDocs(collection(db, 'colleges'));
      const fetchedColleges = collegesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
      if (fetchedColleges.length > 0) {
        setInitialColleges(fetchedColleges);
      } else {
        setInitialColleges(sampleColleges); // Use sample data if firestore is empty
      }

      if (user) {
        const bookmarksSnapshot = await getDocs(collection(db, 'users', user.uid, 'bookmarkedColleges'));
        const bookmarks = bookmarksSnapshot.docs.map(doc => doc.id);
        setBookmarkedColleges(bookmarks);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load college list or bookmarks.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
  
  const toggleBookmark = async (collegeId: string, collegeData: College) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to bookmark colleges.' });
      return;
    }
    const isBookmarked = bookmarkedColleges.includes(collegeId);
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarkedColleges', collegeId);
    
    try {
        if (isBookmarked) {
            await deleteDoc(bookmarkRef);
            setBookmarkedColleges(prev => prev.filter(id => id !== collegeId));
            toast({ title: 'Bookmark Removed', description: `${collegeData.name} has been removed from your bookmarks.` });
        } else {
            await setDoc(bookmarkRef, { ...collegeData, bookmarkedAt: new Date() });
            setBookmarkedColleges(prev => [...prev, collegeId]);
            toast({ title: 'Bookmarked!', description: `${collegeData.name} has been added to your bookmarks.` });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update your bookmarks. Please try again.' });
    }
  };
  
  const collegesToDisplay = filteredColleges !== null ? filteredColleges : initialColleges.map(c => ({...c, id: c.id}));


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
        <p className="text-muted-foreground">Use natural language to search for colleges. Try &quot;colleges in Delhi with B.Sc&quot; or &quot;show me colleges with a hostel&quot;.</p>
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
            const collegeId = (college as College).id || college.name; // Handle both initial and AI search results
            const isBookmarked = bookmarkedColleges.includes(collegeId);
            
            return (
              <Card key={collegeId} className="flex flex-col">
                <CardHeader className="flex-row justify-between items-start">
                  <div>
                    <CardTitle>{college.name}</CardTitle>
                    <CardDescription>Medium: {college.medium}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleBookmark(collegeId, college)}>
                    <Bookmark className={cn("h-5 w-5 text-muted-foreground", isBookmarked && "fill-accent text-accent")} />
                    <span className="sr-only">Bookmark College</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h4 className="font-semibold mb-2 text-sm">Courses Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {college.courses?.map((course) => (
                        <Badge key={course} variant="secondary">{course}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm mt-4">Facilities</h4>
                    <div className="flex flex-wrap gap-4">
                      {college.facilities?.map((facility) => (
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
