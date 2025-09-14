import { useMutation } from '@tanstack/react-query';
import { Message } from '@/types/chat';

interface ChatResponse {
  message: string;
  conversationId: string;
}

// Send message to chat API
export function useChatAPI() {
  return useMutation({
    mutationFn: async ({ 
      message, 
      conversationId, 
      history 
    }: { 
      message: string; 
      conversationId: string; 
      history: Message[] 
    }): Promise<ChatResponse> => {
      const response = await fetch('/api/chat', {
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

      return response.json();
    },
  });
}

// Stream chat response
export function useChatStream() {
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
  });
}
