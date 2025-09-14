import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Input validation schemas
export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  lastMessage: z.string(),
  timestamp: z.date(),
  category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']),
});

export const createConversationSchema = z.object({
  title: z.string(),
  lastMessage: z.string(),
  category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']),
});

export const updateConversationSchema = z.object({
  id: z.string(),
  updates: z.object({
    title: z.string().optional(),
    lastMessage: z.string().optional(),
    category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']).optional(),
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
  sender: z.enum(['user', 'ai']),
  content: z.string(),
  timestamp: z.date(),
  status: z.enum(['sending', 'sent', 'failed']),
});

export const sendMessageSchema = z.object({
  message: z.string(),
  conversationId: z.string(),
  history: z.array(messageSchema),
});

// Type exports
export type Conversation = z.infer<typeof conversationSchema>;
export type CreateConversation = z.infer<typeof createConversationSchema>;
export type UpdateConversation = z.infer<typeof updateConversationSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Message = z.infer<typeof messageSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
