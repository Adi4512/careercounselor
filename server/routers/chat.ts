import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, messageSchema, sendMessageSchema } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { careerAI } from '@/lib/ai';

export const chatRouter = router({
  // Get messages for a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string(), cursor: z.string().nullable().optional(), limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ input, ctx }) => {
      const { conversationId, cursor, limit } = input;
      
      // Handle empty or invalid conversation ID
      if (!conversationId || conversationId === 'skip' || conversationId.trim() === '') {
        return { items: [], nextCursor: null };
      }
      
      // Verify user owns the conversation
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: ctx.user.id }
      });
      
      if (!conversation) {
        throw new Error('Conversation not found or access denied');
      }
      
      const items = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        select: { id: true, role: true, content: true, createdAt: true, parentMessageId: true },
      });
      let nextCursor: string | null = null;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next?.id ?? null;
      }
      // return chronological order
      return { items: items.reverse(), nextCursor };
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ input, ctx }) => {
      const { message, conversationId, parentMessageId } = input;
      
      // Verify user owns the conversation
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: ctx.user.id }
      });
      
      if (!conversation) {
        throw new Error('Conversation not found or access denied');
      }
      
      const userMessage = await prisma.message.create({
        data: {
          conversationId,
          role: 'user',
          content: message,
          parentMessageId: parentMessageId ?? null,
        },
        select: { id: true, role: true, content: true, createdAt: true, parentMessageId: true },
      });

      // Get AI response using OpenRouter
      const messageHistory = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 10, // Last 10 messages for context
        select: { role: true, content: true, createdAt: true }
      });
      
      // Convert to format expected by AI
      const formattedHistory = messageHistory.map(msg => ({
        id: msg.createdAt.toISOString(),
        sender: msg.role as 'user' | 'ai',
        content: msg.content,
        timestamp: msg.createdAt,
        status: 'sent' as const
      }));
      
      // Use streaming for typing effect
      let fullResponse = '';
      
      for await (const chunk of careerAI.getCareerCounselingStream(message, formattedHistory)) {
        fullResponse += chunk;
        // Add small delay to simulate typing
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const aiMessage = await prisma.message.create({
        data: {
          conversationId,
          role: 'ai',
          content: fullResponse,
          parentMessageId: userMessage.id,
        },
        select: { id: true, role: true, content: true, createdAt: true, parentMessageId: true },
      });

      return { userMessage, aiMessage };
    }),

  // Stream message (for real-time chat)
  streamMessage: protectedProcedure
    .input(sendMessageSchema)
    .subscription(async function* ({ input, ctx }) {
      const { message, conversationId, parentMessageId } = input;
      
      // Verify user owns the conversation
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: ctx.user.id }
      });
      
      if (!conversation) {
        yield { type: 'error', content: 'Conversation not found or access denied' };
        return;
      }
      
      // Get message history for context
      const messageHistory = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 10,
        select: { role: true, content: true, createdAt: true }
      });
      
      // Convert to format expected by AI
      const formattedHistory = messageHistory.map(msg => ({
        id: msg.createdAt.toISOString(),
        sender: msg.role as 'user' | 'ai',
        content: msg.content,
        timestamp: msg.createdAt,
        status: 'sent' as const
      }));
      
      let fullResponse = '';
      
      try {
        // Stream AI response
        for await (const chunk of careerAI.getCareerCounselingStream(message, formattedHistory)) {
          fullResponse += chunk;
          yield { type: 'chunk', content: chunk };
        }
        
        // Save complete response to database
        const aiMessage = await prisma.message.create({
          data: {
            conversationId,
            role: 'ai',
            content: fullResponse,
            parentMessageId: parentMessageId ?? null,
          },
          select: { id: true, role: true, content: true, createdAt: true, parentMessageId: true },
        });
        
        yield { type: 'done', content: 'Response complete', messageId: aiMessage.id };
        
      } catch (error) {
        console.error('Streaming error:', error);
        yield { type: 'error', content: 'Sorry, I encountered an error. Please try again.' };
      }
    }),

  // Clear messages for a conversation
  clearMessages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the conversation
      const conversation = await prisma.conversation.findFirst({
        where: { id: input.conversationId, userId: ctx.user.id }
      });
      
      if (!conversation) {
        throw new Error('Conversation not found or access denied');
      }
      
      await prisma.message.deleteMany({ where: { conversationId: input.conversationId } });
      return { success: true };
    }),
});
