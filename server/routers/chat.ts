import { z } from 'zod';
import { router, publicProcedure, messageSchema, sendMessageSchema } from '@/lib/trpc';

// Mock messages storage
const messages: Record<string, any[]> = {};

export const chatRouter = router({
  // Get messages for a conversation
  getMessages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(({ input }) => {
      return messages[input.conversationId] || [];
    }),

  // Send a message
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .mutation(async ({ input }) => {
      const { message, conversationId, history } = input;
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        sender: 'user' as const,
        content: message,
        timestamp: new Date(),
        status: 'sent' as const,
      };

      // Initialize conversation messages if not exists
      if (!messages[conversationId]) {
        messages[conversationId] = [];
      }

      messages[conversationId].push(userMessage);

      // Simulate AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai' as const,
        content: `I received your message: "${message}". This is a simulated AI response.`,
        timestamp: new Date(),
        status: 'sent' as const,
      };

      messages[conversationId].push(aiMessage);

      return {
        userMessage,
        aiMessage,
      };
    }),

  // Stream message (for real-time chat)
  streamMessage: publicProcedure
    .input(sendMessageSchema)
    .subscription(async function* ({ input }) {
      const { message, conversationId } = input;
      
      // Simulate streaming response
      const chunks = [
        "I'm thinking about your question...",
        "Let me analyze your career situation...",
        "Based on your background, I recommend...",
        "Here's my detailed response to your question."
      ];

      for (const chunk of chunks) {
        yield { type: 'chunk', content: chunk };
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      yield { type: 'done', content: 'Response complete' };
    }),

  // Clear messages for a conversation
  clearMessages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(({ input }) => {
      messages[input.conversationId] = [];
      return { success: true };
    }),
});
