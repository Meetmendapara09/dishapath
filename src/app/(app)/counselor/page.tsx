import { MessageSquare } from "lucide-react";
import { Chat } from "./_components/chat";

export default function CounselorPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
       <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><MessageSquare className="text-primary"/> AI Career Counselor</h1>
        <p className="text-muted-foreground">Ask anything about courses, colleges, careers, and exams.</p>
      </div>
      <Chat />
    </div>
  );
}
