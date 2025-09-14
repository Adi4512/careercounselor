import { router } from '@/lib/trpc';
import { conversationsRouter } from './conversations';
import { settingsRouter } from './settings';
import { chatRouter } from './chat';

export const appRouter = router({
  conversations: conversationsRouter,
  settings: settingsRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
