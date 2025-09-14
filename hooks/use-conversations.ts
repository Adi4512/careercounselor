import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  category: 'career-planning' | 'job-search' | 'skill-development' | 'general';
}

// Query key factory
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: string) => [...conversationKeys.lists(), { filters }] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

// Get conversations from localStorage
const getConversations = (): Conversation[] => {
  if (typeof window === 'undefined') return [];
  
  const savedConversations = localStorage.getItem('career-counselor-conversations');
  if (savedConversations) {
    return JSON.parse(savedConversations).map((conv: any) => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }));
  }
  return [];
};

// Save conversations to localStorage
const saveConversations = (conversations: Conversation[]) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('career-counselor-conversations', JSON.stringify(conversations));
};

// Hook to get all conversations
export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: getConversations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, Omit<Conversation, 'id'>>({
    mutationFn: async (conversation: Omit<Conversation, 'id'>) => {
      const newConversation: Conversation = {
        ...conversation,
        id: Date.now().toString(),
      };
      
      const currentConversations = getConversations();
      const updatedConversations = [newConversation, ...currentConversations];
      saveConversations(updatedConversations);
      
      return newConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

// Hook to update a conversation
export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation | undefined, Error, { id: string; updates: Partial<Conversation> }>({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Conversation> }) => {
      const currentConversations = getConversations();
      const updatedConversations = currentConversations.map(conv =>
        conv.id === id ? { ...conv, ...updates } : conv
      );
      saveConversations(updatedConversations);
      
      return updatedConversations.find(conv => conv.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

// Hook to delete a conversation
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: async (id: string) => {
      const currentConversations = getConversations();
      const updatedConversations = currentConversations.filter(conv => conv.id !== id);
      saveConversations(updatedConversations);
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
