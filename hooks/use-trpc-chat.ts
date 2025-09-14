import { trpc } from '@/lib/trpc-client';

// tRPC hooks for chat
export function useChatMessages(conversationId: string) {
  return trpc.chat.getMessages.useQuery({ conversationId });
}

export function useSendMessage() {
  const utils = trpc.useUtils();
  
  return trpc.chat.sendMessage.useMutation({
    onSuccess: (_, variables) => {
      utils.chat.getMessages.invalidate({ conversationId: variables.conversationId });
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
