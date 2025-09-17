// src/app/(app)/dashboard/_components/bookmarked-colleges.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bookmark, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkedCollege {
  id: string;
  name: string;
}

export function BookmarkedColleges() {
  const { user } = useAuth();
  const [bookmarkedColleges, setBookmarkedColleges] = useState<BookmarkedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    };
    
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users', user.uid, 'bookmarkedColleges'));
      const bookmarks = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setBookmarkedColleges(bookmarks);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your bookmarked colleges.' });
    } finally {
        setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (collegeId: string, collegeName: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'bookmarkedColleges', collegeId));
      // Refresh the list after removing a bookmark
      fetchBookmarks();
      toast({ title: 'Bookmark Removed', description: `${collegeName} has been removed from your bookmarks.` });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not remove the bookmark. Please try again.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookmarked Colleges</CardTitle>
        <CardDescription>Your saved colleges for quick access.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookmarkedColleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 border-dashed border-2 rounded-lg">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No Bookmarks Yet</p>
            <p className="text-xs text-muted-foreground">Go to the "Find Colleges" page to add some.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {bookmarkedColleges.map((college) => (
              <li key={college.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <p className="font-medium text-sm text-secondary-foreground">{college.name}</p>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleRemoveBookmark(college.id, college.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Remove Bookmark</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
