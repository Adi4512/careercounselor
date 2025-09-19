import { trpc } from '@/lib/trpc-client';

// tRPC hooks for conversations
export function useConversations(limit = 20, options?: { enabled?: boolean }) {
  return trpc.conversations.getAll.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: options?.enabled ?? true,
    }
  );
}

export function useConversation(id: string) {
  return trpc.conversations.getById.useQuery({ id });
}

export function useCreateConversation() {
  const utils = trpc.useUtils();
  
  return trpc.conversations.create.useMutation({
    onSuccess: (newConversation) => {
      // Invalidate to refetch all conversations with the new one
      utils.conversations.getAll.invalidate();
      
      // Also invalidate individual conversation query
      utils.conversations.getById.invalidate({ id: newConversation.id });
    },
  });
}

export function useUpdateConversation() {
  const utils = trpc.useUtils();
  
  return trpc.conversations.update.useMutation({
    onSuccess: () => {
      utils.conversations.getAll.invalidate();
    },
  });
}

export function useDeleteConversation() {
  const utils = trpc.useUtils();
  
  return trpc.conversations.delete.useMutation({
    onSuccess: () => {
      utils.conversations.getAll.invalidate();
    },
  });
}

export function useConversationsByCategory(category: 'career-planning' | 'job-search' | 'skill-development' | 'general') {
  return trpc.conversations.getByCategory.useQuery({ category });
}
