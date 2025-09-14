import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/types/chat';

// Query key factory for chat
export const chatKeys = {
  all: ['chat'] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

// Send message mutation
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      message, 
      conversationId, 
      history 
    }: { 
      message: string; 
      conversationId: string; 
      history: Message[] 
    }) => {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.messages(variables.conversationId) 
      });
    },
  });
}

// Hook for managing chat state
export function useChatState(conversationId: string) {
  const queryClient = useQueryClient();

  const addMessage = (message: Message) => {
    queryClient.setQueryData(
      chatKeys.messages(conversationId),
      (oldMessages: Message[] = []) => [...oldMessages, message]
    );
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    queryClient.setQueryData(
      chatKeys.messages(conversationId),
      (oldMessages: Message[] = []) =>
        oldMessages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
    );
  };

  const getMessages = (): Message[] => {
    return queryClient.getQueryData(chatKeys.messages(conversationId)) || [];
  };

  return {
    addMessage,
    updateMessage,
    getMessages,
  };
}
