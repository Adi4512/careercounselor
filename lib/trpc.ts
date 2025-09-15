import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Initialize tRPC
const t = initTRPC.create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async ({ next }) => {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized - Please sign in');
  }
  
  // Find or create user in database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) {
    throw new Error('User not found in database');
  }
  
  return next({
    ctx: {
      user,
      session
    }
  });
});

// Input validation schemas
export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createConversationSchema = z.object({
  title: z.string(),
});

export const updateConversationSchema = z.object({
  id: z.string(),
  updates: z.object({
    title: z.string().optional(),
  }),
});

export const settingsSchema = z.object({
  aiPersonality: z.enum(['professional', 'friendly', 'direct']),
  responseLength: z.enum(['brief', 'detailed', 'comprehensive']),
  enableNotifications: z.boolean(),
  autoSave: z.boolean(),
  theme: z.enum(['dark', 'light']),
});

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'ai']),
  content: z.string(),
  createdAt: z.date(),
  parentMessageId: z.string().nullable(),
});

export const sendMessageSchema = z.object({
  message: z.string(),
  conversationId: z.string(),
  parentMessageId: z.string().nullable().optional(),
});

// Type exports
export type Conversation = z.infer<typeof conversationSchema>;
export type CreateConversation = z.infer<typeof createConversationSchema>;
export type UpdateConversation = z.infer<typeof updateConversationSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Message = z.infer<typeof messageSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
