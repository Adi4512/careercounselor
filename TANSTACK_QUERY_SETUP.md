# TanStack Query Implementation

This document outlines the TanStack Query (React Query) implementation in the Elevare AI Career Counselor application.

## Overview

TanStack Query has been integrated to provide:
- Server state management
- Caching
- Background updates
- Optimistic updates
- Error handling
- Loading states

## Setup

### 1. Dependencies Installed
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Provider Setup
- Created `lib/providers.tsx` with QueryClient configuration
- Wrapped the app in `app/layout.tsx` with the QueryClientProvider
- Added React Query DevTools for development

### 3. Query Client Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Hooks Created

### 1. `hooks/use-conversations.ts`
Manages conversation data with localStorage persistence:

- `useConversations()` - Get all conversations
- `useCreateConversation()` - Create new conversation
- `useUpdateConversation()` - Update conversation
- `useDeleteConversation()` - Delete conversation

**Query Keys:**
```typescript
conversationKeys = {
  all: ['conversations'],
  lists: () => [...conversationKeys.all, 'list'],
  list: (filters: string) => [...conversationKeys.lists(), { filters }],
  details: () => [...conversationKeys.all, 'detail'],
  detail: (id: string) => [...conversationKeys.details(), id],
}
```

### 2. `hooks/use-settings.ts`
Manages user settings with localStorage persistence:

- `useSettings()` - Get current settings
- `useUpdateSettings()` - Update settings

**Query Keys:**
```typescript
settingsKeys = {
  all: ['settings'],
  current: () => [...settingsKeys.all, 'current'],
}
```

### 3. `hooks/use-chat.ts`
Manages chat state and message operations:

- `useSendMessage()` - Send message mutation
- `useChatState(conversationId)` - Chat state management

### 4. `hooks/use-chat-api.ts`
API integration hooks:

- `useChatAPI()` - Regular chat API calls
- `useChatStream()` - Streaming chat responses

## Usage Examples

### Creating a New Conversation
```typescript
const createConversation = useCreateConversation();

const handleNewChat = () => {
  createConversation.mutate({
    title: 'New Chat',
    lastMessage: 'Start a new conversation...',
    timestamp: new Date(),
    category: 'general'
  }, {
    onSuccess: (newConversation) => {
      setActiveConversationId(newConversation.id);
    }
  });
};
```

### Updating Settings
```typescript
const updateSettings = useUpdateSettings();

const handleSettingsChange = (newSettings) => {
  updateSettings.mutate(newSettings);
};
```

### Sending a Message
```typescript
const sendMessage = useSendMessage();

const handleSend = (message: string) => {
  sendMessage.mutate({
    message,
    conversationId: activeConversationId,
    history: messages
  });
};
```

## Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Updates**: Data stays fresh with automatic refetching
3. **Optimistic Updates**: UI updates immediately, rolls back on error
4. **Error Handling**: Built-in error states and retry logic
5. **Loading States**: Automatic loading state management
6. **DevTools**: React Query DevTools for debugging
7. **TypeScript Support**: Full TypeScript support with type safety

## Query Invalidation

Queries are automatically invalidated when related data changes:

```typescript
// After creating a conversation
queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });

// After updating settings
queryClient.setQueryData(settingsKeys.current(), updatedSettings);
```

## Development Tools

React Query DevTools are available in development mode:
- Shows all queries and their states
- Allows manual query invalidation
- Displays cache contents
- Performance monitoring

## Best Practices

1. **Query Key Factory**: Use consistent query key patterns
2. **Error Boundaries**: Wrap components with error boundaries
3. **Loading States**: Always handle loading and error states
4. **Optimistic Updates**: Use for better UX
5. **Stale Time**: Set appropriate stale times for different data types
6. **Retry Logic**: Configure retry behavior based on error types

## Migration from useState/useEffect

The following patterns were replaced:

**Before:**
```typescript
const [conversations, setConversations] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  // Load data
}, []);
```

**After:**
```typescript
const { data: conversations, isLoading } = useConversations();
```

This provides better performance, caching, and error handling out of the box.
