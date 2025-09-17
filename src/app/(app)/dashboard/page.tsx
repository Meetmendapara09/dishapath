
'use client';

import { useState, useCallback } from 'react';
import { PersonalizedRecsForm } from './_components/personalized-recs-form';
import { useAuth } from '@/contexts/auth-context';
import { Timeline } from './_components/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SavedRecommendations } from './_components/saved-recs';

export default function DashboardPage() {
  const { user } = useAuth();
  // State to trigger re-render of SavedRecommendations
  const [key, setKey] = useState(0);

  const handleRecommendationGenerated = useCallback(() => {
    setKey(prevKey => prevKey + 1);
  }, []);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Welcome, {user?.displayName || 'Student'}!</h1>
        <p className="text-muted-foreground">Your personalized guide to a bright future starts here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Fill in your details to get AI-powered course, college, and career suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalizedRecsForm onRecommendationGenerated={handleRecommendationGenerated} />
            </CardContent>
          </Card>
          
          <SavedRecommendations key={key} />

        </div>
        
        <div className="space-y-6">
           <Timeline />
        </div>
      </div>
    </div>
  );
}

    
