import { trpc } from '@/lib/trpc-client';

// tRPC hooks for chat
export function useChatMessages(conversationId: string, limit = 50, options?: { enabled?: boolean }) {
  return trpc.chat.getMessages.useInfiniteQuery(
    { conversationId, limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: options?.enabled ?? true,
    }
  );
}

export function useSendMessage() {
  const utils = trpc.useUtils();
  
  return trpc.chat.sendMessage.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.chat.getMessages.cancel({ conversationId: variables.conversationId, limit: 50 });
      
      // Snapshot the previous value
      const previousMessages = utils.chat.getMessages.getInfiniteData({ conversationId: variables.conversationId, limit: 50 });
      
      // Optimistically update to show user message immediately
      const optimisticUserMessage = {
        id: `temp-user-${Date.now()}`,
        role: 'user' as const,
        content: variables.message,
        createdAt: new Date().toISOString(),
        parentMessageId: null
      };
      
      if (previousMessages) {
        utils.chat.getMessages.setInfiniteData(
          { conversationId: variables.conversationId, limit: 50 },
          (old) => {
            if (!old) return old;
            const newPages = [...old.pages];
            if (newPages.length > 0) {
              newPages[0] = {
                ...newPages[0],
                items: [...newPages[0].items, optimisticUserMessage]
              };
            }
            return { ...old, pages: newPages };
          }
        );
      }
      
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousMessages) {
        utils.chat.getMessages.setInfiniteData(
          { conversationId: variables.conversationId, limit: 50 },
          context.previousMessages
        );
      }
    },
    onSuccess: (_, variables) => {
      // Refetch to get the real messages (user + AI response)
      utils.chat.getMessages.invalidate({ conversationId: variables.conversationId, limit: 50 });
    },
  });
}

export function useStreamMessage() {
  return trpc.chat.streamMessage.useSubscription;
}

export function useClearMessages() {
  const utils = trpc.useUtils();
  
  return trpc.chat.clearMessages.useMutation({
    onSuccess: (_, variables) => {
      utils.chat.getMessages.invalidate({ conversationId: variables.conversationId });
    },
  });
}
