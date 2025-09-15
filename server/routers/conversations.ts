import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, conversationSchema, createConversationSchema, updateConversationSchema } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';

export const conversationsRouter = router({
  // Get all conversations
  getAll: protectedProcedure
    .input(z.object({ cursor: z.string().nullable().optional(), limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ input, ctx }) => {
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor ?? undefined;
      const items = await prisma.conversation.findMany({
        where: { userId: ctx.user.id }, // Only get user's conversations
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: string | null = null;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next?.id ?? null;
      }
      return { items, nextCursor };
    }),

  // Get conversation by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: input.id } });
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      return conversation;
    }),

  // Create new conversation
  create: protectedProcedure
    .input(createConversationSchema)
    .mutation(async ({ input, ctx }) => {
      const conversation = await prisma.conversation.create({
        data: {
          title: input.title,
          userId: ctx.user.id, // Real user ID from NextAuth session
        },
      });
      return conversation;
    }),

  // Update conversation
  update: protectedProcedure
    .input(updateConversationSchema)
    .mutation(async ({ input, ctx }) => {
      const conversation = await prisma.conversation.update({
        where: { 
          id: input.id,
          userId: ctx.user.id // Ensure user owns the conversation
        },
        data: input.updates,
      });
      return conversation;
    }),

  // Delete conversation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.conversation.delete({ 
        where: { 
          id: input.id,
          userId: ctx.user.id // Ensure user owns the conversation
        } 
      });
      return { success: true };
    }),

  // Get conversations by category
  // Placeholder to keep API similar; categories removed in new model
  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']) }))
    .query(async () => {
      const items = await prisma.conversation.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
      return items;
    }),
});
