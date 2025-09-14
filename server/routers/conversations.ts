import { z } from 'zod';
import { router, publicProcedure, conversationSchema, createConversationSchema, updateConversationSchema } from '@/lib/trpc';

// Mock data storage (in real app, this would be a database)
let conversations: any[] = [];

export const conversationsRouter = router({
  // Get all conversations
  getAll: publicProcedure
    .query(() => {
      return conversations;
    }),

  // Get conversation by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const conversation = conversations.find(conv => conv.id === input.id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      return conversation;
    }),

  // Create new conversation
  create: publicProcedure
    .input(createConversationSchema)
    .mutation(({ input }) => {
      const newConversation = {
        id: Date.now().toString(),
        ...input,
        timestamp: new Date(),
      };
      conversations.unshift(newConversation);
      return newConversation;
    }),

  // Update conversation
  update: publicProcedure
    .input(updateConversationSchema)
    .mutation(({ input }) => {
      const index = conversations.findIndex(conv => conv.id === input.id);
      if (index === -1) {
        throw new Error('Conversation not found');
      }
      
      conversations[index] = {
        ...conversations[index],
        ...input.updates,
      };
      return conversations[index];
    }),

  // Delete conversation
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = conversations.findIndex(conv => conv.id === input.id);
      if (index === -1) {
        throw new Error('Conversation not found');
      }
      
      conversations.splice(index, 1);
      return { success: true };
    }),

  // Get conversations by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']) }))
    .query(({ input }) => {
      return conversations.filter(conv => conv.category === input.category);
    }),
});
