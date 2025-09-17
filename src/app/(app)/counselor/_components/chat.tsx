'use client';

import {useState, useRef, useEffect} from 'react';
import {useActions, useUIState, useAIState} from 'ai/rsc';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Send, User, Bot, Sparkles} from 'lucide-react';
import {cn} from '@/lib/utils';
import { careerCounselorChat } from '@/ai/flows/career-counselor-chat';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type UserProfile = {
  displayName?: string;
  class?: string;
  academicInterests?: string;
}

export function Chat() {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useAIState<any[]>([]);
  const {stream, done} = useActions({
    careerCounselorChat: careerCounselorChat
  });
  const [streaming, setStreaming] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            displayName: userData.displayName,
            class: userData.class,
            academicInterests: userData.academicInterests,
          });
        }
      }
    }
    fetchProfile();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (done && streaming) {
      setStreaming(false);
    }
  }, [done, streaming])

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mb-4 text-primary" />
            <p className="text-lg font-semibold">Welcome to the AI Counselor!</p>
            <p>You can ask me questions like:</p>
            <ul className="mt-2 text-sm list-disc list-inside">
              <li>"What are the career options after 12th science?"</li>
              <li>"Tell me about the CUET exam."</li>
              <li>"What is the difference between B.Tech and B.E.?"</li>
            </ul>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'p-3 rounded-lg max-w-md prose prose-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background'
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
            </div>
             {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;

            const userMessage = { role: 'user', content: inputValue };
            setMessages([...messages, userMessage]);
            setInputValue('');

            let accumulatedContent = '';
            setStreaming(true);
            
            // Map messages to the format expected by the AI flow
            const historyForAI = messages.map(m => ({
              role: m.role,
              content: [{text: m.content}]
            }));

            for await (const delta of careerCounselorChat(
              historyForAI,
              inputValue,
              userProfile
            )) {
              accumulatedContent += delta;
              setMessages([
                ...messages,
                userMessage,
                { role: 'assistant', content: accumulatedContent },
              ]);
            }
          }}
        >
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="pr-12"
              disabled={streaming}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
              disabled={streaming || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
