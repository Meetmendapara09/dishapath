
// src/app/(app)/dashboard/_components/saved-recs.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, School, Briefcase, GraduationCap, Trash2, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Recommendation {
  id: string;
  recommendedCourses: string[];
  nearbyColleges: string[];
  careerPaths: string[];
  createdAt: Timestamp;
}

export function SavedRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function fetchRecommendations() {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'users', user.uid, 'recommendations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedRecs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Recommendation));
      setRecommendations(fetchedRecs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch saved recommendations.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  async function handleDelete(recommendationId: string) {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'recommendations', recommendationId));
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
      toast({
        title: 'Deleted',
        description: 'Recommendation set has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete recommendation.',
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">Your Saved Recommendations</h2>
        {recommendations.length === 0 ? (
             <Card className="flex flex-col items-center justify-center text-center p-8 space-y-4 border-dashed">
                <Archive className="h-12 w-12 text-muted-foreground"/>
                <h3 className="text-lg font-semibold">No Saved Recommendations</h3>
                <p className="text-muted-foreground">Your generated recommendations will appear here.</p>
            </Card>
        ) : (
            <div className="space-y-4">
            {recommendations.map(rec => (
                <Card key={rec.id}>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">
                                Recommendation from {rec.createdAt ? format(rec.createdAt.toDate(), 'PPP p') : 'previous session'}
                            </CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(rec.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3"><GraduationCap className="h-5 w-5 text-primary" />Recommended Courses</h3>
                        <div className="flex flex-wrap gap-2">
                            {rec.recommendedCourses.map((course) => (
                            <div key={course} className="bg-primary/10 text-primary-foreground font-medium px-3 py-1 rounded-full text-sm bg-primary">{course}</div>
                            ))}
                        </div>
                        </div>
                        <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3"><School className="h-5 w-5 text-primary" />Nearby Colleges</h3>
                        <div className="flex flex-wrap gap-2">
                            {rec.nearbyColleges.map((college) => (
                            <div key={college} className="bg-secondary text-secondary-foreground font-medium px-3 py-1 rounded-full text-sm">{college}</div>
                            ))}
                        </div>
                        </div>
                        <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3"><Briefcase className="h-5 w-5 text-primary" />Potential Career Paths</h3>
                        <div className="flex flex-wrap gap-2">
                            {rec.careerPaths.map((path) => (
                            <div key={path} className="bg-secondary text-secondary-foreground font-medium px-3 py-1 rounded-full text-sm">{path}</div>
                            ))}
                        </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            </div>
        )}
    </div>
  );
}
    