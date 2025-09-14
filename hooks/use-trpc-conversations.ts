import { trpc } from '@/lib/trpc-client';

// tRPC hooks for conversations
export function useConversations() {
  return trpc.conversations.getAll.useQuery();
}

export function useConversation(id: string) {
  return trpc.conversations.getById.useQuery({ id });
}

export function useCreateConversation() {
  const utils = trpc.useUtils();
  
  return trpc.conversations.create.useMutation({
    onSuccess: () => {
      utils.conversations.getAll.invalidate();
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
