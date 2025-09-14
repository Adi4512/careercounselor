import { z } from 'zod';
import { router, publicProcedure, settingsSchema, Settings } from '@/lib/trpc';

// Mock settings storage
let settings: Settings = {
  aiPersonality: 'professional',
  responseLength: 'detailed',
  enableNotifications: true,
  autoSave: true,
  theme: 'dark',
};

export const settingsRouter = router({
  // Get current settings
  get: publicProcedure
    .query(() => {
      return settings;
    }),

  // Update settings
  update: publicProcedure
    .input(settingsSchema.partial())
    .mutation(({ input }) => {
      settings = { ...settings, ...input };
      return settings;
    }),

  // Reset to default settings
  reset: publicProcedure
    .mutation(() => {
      settings = {
        aiPersonality: 'professional',
        responseLength: 'detailed',
        enableNotifications: true,
        autoSave: true,
        theme: 'dark',
      };
      return settings;
    }),
});
