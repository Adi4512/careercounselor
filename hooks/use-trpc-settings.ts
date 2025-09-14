import { trpc } from '@/lib/trpc-client';
import type { Settings } from '@/lib/trpc';

// Export Settings type
export type { Settings };

// tRPC hooks for settings
export function useSettings() {
  return trpc.settings.get.useQuery();
}

export function useUpdateSettings() {
  const utils = trpc.useUtils();
  
  return trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
    },
  });
}

export function useResetSettings() {
  const utils = trpc.useUtils();
  
  return trpc.settings.reset.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
    },
  });
}
