// src/ai/flows/save-chat-history.ts
'use server';

/**
 * @fileOverview A flow to save a user's chat history to Firestore.
 *
 * - saveChatHistory - Saves a chat session to the database.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db} from '@/lib/firebase';

const MessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'tool']),
    content: z.string(),
});

const SaveChatHistoryInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  messages: z.array(MessageSchema).describe('The chat messages to save.'),
});
export type SaveChatHistoryInput = z.infer<typeof SaveChatHistoryInputSchema>;

export async function saveChatHistory(
  input: SaveChatHistoryInput
): Promise<void> {
  return saveChatHistoryFlow(input);
}

const saveChatHistoryFlow = ai.defineFlow(
  {
    name: 'saveChatHistoryFlow',
    inputSchema: SaveChatHistoryInputSchema,
    outputSchema: z.void(),
  },
  async ({userId, messages}) => {
    if (!userId || messages.length === 0) {
      console.log('Skipping save: userId or messages are empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'users', userId, 'chatSessions'), {
        messages: messages,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving chat history:", error);
      // We don't throw here to avoid breaking the client-side flow.
      // The error is logged for debugging.
    }
  }
);
