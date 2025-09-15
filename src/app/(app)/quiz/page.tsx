import { QuizClient } from "./_components/quiz-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Aptitude & Interest Quiz</h1>
        <p className="text-muted-foreground">Answer a few questions to discover your strengths and get personalized course suggestions.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Let's get started!</CardTitle>
          <CardDescription>This will only take a couple of minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuizClient />
        </CardContent>
      </Card>
    </div>
  );
}
