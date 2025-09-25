'use client';

import {useState, useRef, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Send, User, Bot, Sparkles, Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';
import { careerCounselorChat } from '@/ai/flows/career-counselor-chat';
import { saveChatHistory, SaveChatHistoryInput } from '@/ai/flows/save-chat-history';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type UserProfile = {
  displayName?: string;
  class?: string;
  academicInterests?: string;
}

interface Message {
    role: 'user' | 'assistant' | 'tool';
    content: string;
}

export function Chat() {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

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

  const handleSaveChat = async (updatedMessages: Message[]) => {
    if (!user) return;
    try {
      const messagesToSave: SaveChatHistoryInput['messages'] = updatedMessages.map(m => ({
          role: m.role,
          content: m.content
      }));

      await saveChatHistory({
        userId: user.uid,
        messages: messagesToSave,
      });
    } catch (error) {
        console.error("Failed to save chat history:", error);
        toast({
            variant: 'destructive',
            title: 'Save Error',
            description: "Could not save your chat session."
        })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setStreaming(true);

    try {
      // Map messages to the format expected by the AI flow
      const historyForAI: { role: 'user' | 'model' | 'tool'; content: { text: string }[] }[] = messages.map(m => ({
        role: m.role === 'assistant' ? ('model' as const) : (m.role as 'user' | 'tool'),
        content: [{ text: m.content }]
      }));

      const stream = await careerCounselorChat(
        historyForAI,
        inputValue,
        userProfile
      );
      
      let accumulatedContent = '';
      
      // Add the empty assistant message to start rendering it
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
          const { value, done } = await reader.read();
          if (done) {
              break;
          }
          accumulatedContent += decoder.decode(value, { stream: true });
          setMessages(prev => {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: accumulatedContent };
              return updatedMessages;
          });
      }
      
      // Save the complete conversation history
      const finalAssistantMessage: Message = { role: 'assistant', content: accumulatedContent };
      const conversationToSave = [...newMessages, finalAssistantMessage];
      await handleSaveChat(conversationToSave);

    } catch (error) {
        console.error("Error streaming chat:", error);
        const errorMessage: Message = {
            role: 'assistant',
            content: "Sorry, I encountered an error. Please try again."
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setStreaming(false);
    }
  }


  return (
    <div className="flex flex-col h-full bg-card border rounded-lg">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mb-4 text-primary" />
            <p className="text-lg font-semibold">Welcome to the AI Counselor!</p>
            <p>Your conversations will be saved automatically.</p>
            <ul className="mt-2 text-sm list-disc list-inside">
              <li>&quot;What are the career options after 12th science?&quot;</li>
              <li>&quot;Tell me about the CUET exam.&quot;</li>
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
         {streaming && messages[messages.length - 1]?.role !== 'user' && (
            <div className="flex justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="ml-3 p-3 rounded-lg bg-background flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
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
