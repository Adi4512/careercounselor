# tRPC Implementation & Interview Guide

## 🚀 **tRPC Implementation Overview**

This document covers the complete tRPC implementation in the Elevare AI Career Counselor project and provides comprehensive interview preparation material.

---

## 📋 **Table of Contents**

1. [What is tRPC?](#what-is-trpc)
2. [Project Architecture](#project-architecture)
3. [Implementation Details](#implementation-details)
4. [Key Features Implemented](#key-features-implemented)
5. [Code Examples](#code-examples)
6. [Interview Questions & Answers](#interview-questions--answers)
7. [Technical Deep Dive](#technical-deep-dive)
8. [Best Practices](#best-practices)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting](#troubleshooting)

---

## 🤔 **What is tRPC?**

**tRPC (TypeScript Remote Procedure Call)** is an end-to-end typesafe API framework that allows you to build APIs with full TypeScript inference from client to server.

### **Key Benefits:**
- ✅ **End-to-end type safety** - No more API contracts or code generation
- ✅ **Automatic serialization** - Built-in JSON serialization
- ✅ **Framework agnostic** - Works with any frontend framework
- ✅ **Real-time subscriptions** - WebSocket support
- ✅ **Middleware support** - Authentication, logging, etc.
- ✅ **Excellent DX** - Great developer experience with autocomplete

---

## 🏗️ **Project Architecture**

```
elevare-ai/
├── lib/
│   ├── trpc.ts                 # tRPC configuration & schemas
│   ├── trpc-client.ts          # Client configuration
│   └── providers.tsx           # React Query + tRPC providers
├── server/
│   └── routers/
│       ├── index.ts            # Main router
│       ├── conversations.ts    # Conversation CRUD operations
│       ├── settings.ts         # User settings management
│       └── chat.ts             # Chat & messaging
├── app/api/trpc/[trpc]/
│   └── route.ts                # Next.js API route handler
└── hooks/
    ├── use-trpc-conversations.ts
    ├── use-trpc-settings.ts
    └── use-trpc-chat.ts
```

---

## 🔧 **Implementation Details**

### **1. Core Configuration (`lib/trpc.ts`)**

```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Schema definitions with Zod validation
export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  lastMessage: z.string(),
  timestamp: z.date(),
  category: z.enum(['career-planning', 'job-search', 'skill-development', 'general']),
});
```

**Key Points:**
- Uses Zod for runtime validation
- Type-safe schemas that work both client and server-side
- Centralized type definitions

### **2. Router Implementation (`server/routers/conversations.ts`)**

```typescript
export const conversationsRouter = router({
  getAll: publicProcedure.query(() => {
    return conversations;
  }),

  create: publicProcedure
    .input(createConversationSchema)
    .mutation(({ input }) => {
      const newConversation = {
        id: Date.now().toString(),
        ...input,
        timestamp: new Date(),
      };
      conversations.unshift(newConversation);
      return newConversation;
    }),
});
```

**Key Features:**
- **Queries** for data fetching
- **Mutations** for data modification
- **Subscriptions** for real-time updates
- **Input validation** with Zod schemas

### **3. Client Integration (`lib/trpc-client.ts`)**

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});
```

**Key Features:**
- **React Query integration** for caching and state management
- **HTTP batching** for multiple requests
- **Type-safe client** with full autocomplete

### **4. React Hooks (`hooks/use-trpc-conversations.ts`)**

```typescript
export function useConversations() {
  return trpc.conversations.getAll.useQuery();
}

export function useCreateConversation() {
  const utils = trpc.useUtils();
  
  return trpc.conversations.create.useMutation({
    onSuccess: () => {
      utils.conversations.getAll.invalidate();
    },
  });
}
```

**Key Features:**
- **Automatic caching** with React Query
- **Optimistic updates** for better UX
- **Cache invalidation** on mutations
- **Loading and error states** handled automatically

---

## ✨ **Key Features Implemented**

### **1. Type-Safe API Calls**
```typescript
// Full type safety from client to server
const { data: conversations } = trpc.conversations.getAll.useQuery();
const createConversation = trpc.conversations.create.useMutation();
```

### **2. Real-time Subscriptions**
```typescript
// WebSocket-based real-time updates
const streamMessage = trpc.chat.streamMessage.useSubscription({
  message: "Hello",
  conversationId: "123",
  history: []
});
```

### **3. Input Validation**
```typescript
// Runtime validation with Zod
const createConversation = trpc.conversations.create.useMutation({
  input: {
    title: "New Chat",
    category: "general" // TypeScript will enforce this enum
  }
});
```

### **4. Error Handling**
```typescript
const { data, error, isLoading } = trpc.conversations.getAll.useQuery();

if (error) {
  console.error('Failed to fetch conversations:', error.message);
}
```

---

## 💻 **Code Examples**

### **Basic Query**
```typescript
function ConversationsList() {
  const { data: conversations, isLoading, error } = trpc.conversations.getAll.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {conversations?.map(conv => (
        <li key={conv.id}>{conv.title}</li>
      ))}
    </ul>
  );
}
```

### **Mutation with Optimistic Updates**
```typescript
function CreateConversation() {
  const utils = trpc.useUtils();
  const createConversation = trpc.conversations.create.useMutation({
    onMutate: async (newConversation) => {
      // Cancel outgoing refetches
      await utils.conversations.getAll.cancel();
      
      // Snapshot previous value
      const previousConversations = utils.conversations.getAll.getData();
      
      // Optimistically update
      utils.conversations.getAll.setData(undefined, (old) => [
        { id: 'temp', ...newConversation, timestamp: new Date() },
        ...(old || [])
      ]);
      
      return { previousConversations };
    },
    onError: (err, newConversation, context) => {
      // Rollback on error
      utils.conversations.getAll.setData(undefined, context?.previousConversations);
    },
    onSettled: () => {
      // Refetch after mutation
      utils.conversations.getAll.invalidate();
    },
  });
  
  return (
    <button onClick={() => createConversation.mutate({ title: 'New Chat', category: 'general' })}>
      Create Conversation
    </button>
  );
}
```

### **Real-time Subscription**
```typescript
function ChatStream({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  
  trpc.chat.streamMessage.useSubscription(
    { message: "Hello", conversationId, history: [] },
    {
      onData: (data) => {
        if (data.type === 'chunk') {
          setMessages(prev => [...prev, data.content]);
        }
      }
    }
  );
  
  return (
    <div>
      {messages.map((msg, i) => <div key={i}>{msg}</div>)}
    </div>
  );
}
```

---

## 🎯 **Interview Questions & Answers**

### **Q1: What is tRPC and why did you choose it?**

**Answer:**
"tRPC is an end-to-end typesafe API framework that eliminates the need for API contracts and code generation. I chose it because:

1. **Type Safety**: Full TypeScript inference from client to server
2. **Developer Experience**: Excellent autocomplete and error detection
3. **Performance**: Built-in request batching and caching
4. **Real-time**: Native WebSocket support for subscriptions
5. **Framework Agnostic**: Works with any frontend framework

In our career counseling app, it ensures that conversation data, user settings, and chat messages are all type-safe across the entire stack."

### **Q2: How does tRPC differ from REST APIs or GraphQL?**

**Answer:**
"tRPC combines the best of both worlds:

**vs REST:**
- Type safety (REST has no built-in types)
- Automatic serialization
- Better developer experience
- Built-in caching with React Query

**vs GraphQL:**
- Simpler setup (no schema definition needed)
- Better TypeScript integration
- Smaller bundle size
- More straightforward for CRUD operations

**When to use tRPC:**
- TypeScript-first projects
- Internal APIs
- Real-time applications
- When you want maximum type safety

**When to use GraphQL:**
- Public APIs
- Complex data fetching requirements
- When you need schema introspection"

### **Q3: Explain the tRPC architecture in your project.**

**Answer:**
"Our architecture follows tRPC best practices:

1. **Server Layer** (`server/routers/`):
   - Separate routers for different domains (conversations, settings, chat)
   - Zod schemas for input validation
   - Type-safe procedures (queries, mutations, subscriptions)

2. **API Layer** (`app/api/trpc/`):
   - Next.js API route handler
   - HTTP batching for performance
   - Automatic serialization

3. **Client Layer** (`lib/trpc-client.ts`):
   - React Query integration
   - Type-safe client with full autocomplete
   - Optimistic updates and caching

4. **React Layer** (`hooks/use-trpc-*`):
   - Custom hooks for each domain
   - Automatic loading and error states
   - Cache invalidation on mutations"

### **Q4: How do you handle authentication with tRPC?**

**Answer:**
"tRPC supports middleware for authentication:

```typescript
// Create authenticated procedure
const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe user context
    },
  });
});

// Use in routers
export const conversationsRouter = router({
  getMyConversations: protectedProcedure.query(({ ctx }) => {
    // ctx.user is now type-safe
    return getConversationsByUserId(ctx.user.id);
  }),
});
```

**Context Creation:**
```typescript
const createContext = ({ req }: CreateNextContextOptions) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = verifyToken(token);
  return { user };
};
```

### **Q5: How do you handle errors in tRPC?**

**Answer:**
"tRPC provides structured error handling:

```typescript
// Server-side error throwing
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Conversation not found',
  cause: error,
});

// Client-side error handling
const { data, error, isLoading } = trpc.conversations.getAll.useQuery();

if (error) {
  switch (error.data?.code) {
    case 'NOT_FOUND':
      return <div>Conversation not found</div>;
    case 'UNAUTHORIZED':
      return <div>Please log in</div>;
    default:
      return <div>Something went wrong</div>;
  }
}
```

**Error Types:**
- `BAD_REQUEST` - Invalid input
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error"

### **Q6: Explain tRPC subscriptions and real-time features.**

**Answer:**
"tRPC supports real-time subscriptions using WebSockets:

```typescript
// Server-side subscription
export const chatRouter = router({
  streamMessage: publicProcedure
    .input(sendMessageSchema)
    .subscription(async function* ({ input }) {
      for (const chunk of responseChunks) {
        yield { type: 'chunk', content: chunk };
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      yield { type: 'done' };
    }),
});

// Client-side usage
const streamMessage = trpc.chat.streamMessage.useSubscription(
  { message: "Hello", conversationId: "123", history: [] },
  {
    onData: (data) => {
      if (data.type === 'chunk') {
        setMessages(prev => [...prev, data.content]);
      }
    }
  }
);
```

**Use Cases:**
- Real-time chat
- Live notifications
- Progress updates
- Collaborative editing"

### **Q7: How do you optimize tRPC performance?**

**Answer:**
"Several optimization strategies:

1. **Request Batching:**
```typescript
// Multiple requests batched into one HTTP request
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: '/api/trpc' })],
});
```

2. **Caching with React Query:**
```typescript
// Automatic caching and background updates
const { data } = trpc.conversations.getAll.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

3. **Optimistic Updates:**
```typescript
const createConversation = trpc.conversations.create.useMutation({
  onMutate: async (newConversation) => {
    // Optimistically update UI
    utils.conversations.getAll.setData(undefined, (old) => [
      { id: 'temp', ...newConversation },
      ...(old || [])
    ]);
  },
});
```

4. **Selective Queries:**
```typescript
// Only fetch what you need
const { data: titles } = trpc.conversations.getAll.useQuery(undefined, {
  select: (conversations) => conversations.map(c => c.title),
});
```"

### **Q8: How do you test tRPC applications?**

**Answer:**
"tRPC testing strategies:

1. **Unit Testing Procedures:**
```typescript
import { createCaller } from '@/server/routers';

const caller = createCaller({});

test('should create conversation', async () => {
  const result = await caller.conversations.create({
    title: 'Test Chat',
    category: 'general',
  });
  
  expect(result.title).toBe('Test Chat');
});
```

2. **Integration Testing:**
```typescript
import { createTRPCMsw } from 'msw-trpc';
import { appRouter } from '@/server/routers';

const trpcMsw = createTRPCMsw(appRouter);

// Mock API responses
server.use(
  trpcMsw.conversations.getAll.query((req, res, ctx) => {
    return res(ctx.data(mockConversations));
  })
);
```

3. **E2E Testing:**
```typescript
// Test the full flow
test('should create and display conversation', async () => {
  render(<App />);
  
  await user.click(screen.getByText('New Chat'));
  await user.type(screen.getByPlaceholderText('Title'), 'Test Chat');
  await user.click(screen.getByText('Create'));
  
  expect(screen.getByText('Test Chat')).toBeInTheDocument();
});
```"

---

## 🔍 **Technical Deep Dive**

### **1. Type Safety Flow**

```typescript
// 1. Define schema
const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
});

// 2. Create procedure
const getConversation = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    // input.id is typed as string
    return getConversationById(input.id);
  });

// 3. Use in client
const { data } = trpc.conversations.getById.useQuery({ id: "123" });
// data is fully typed as Conversation | undefined
```

### **2. Middleware Chain**

```typescript
const loggingMiddleware = t.middleware(async ({ next, path, type, input }) => {
  console.log(`→ ${type} ${path}`, input);
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  console.log(`← ${type} ${path} (${duration}ms)`);
  return result;
});

const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(authMiddleware);
```

### **3. Context and Dependency Injection**

```typescript
interface Context {
  user: User;
  db: Database;
  logger: Logger;
}

const createContext = ({ req }: CreateNextContextOptions): Context => {
  return {
    user: getUserFromToken(req.headers.authorization),
    db: new Database(),
    logger: new Logger(),
  };
};

// Use in procedures
const getConversations = publicProcedure
  .query(({ ctx }) => {
    // ctx.db and ctx.user are fully typed
    return ctx.db.conversations.findMany({
      where: { userId: ctx.user.id }
    });
  });
```

---

## 📚 **Best Practices**

### **1. Router Organization**
```typescript
// ✅ Good: Domain-based organization
server/
├── routers/
│   ├── conversations.ts
│   ├── settings.ts
│   └── chat.ts
└── index.ts

// ❌ Bad: All procedures in one file
server/
└── router.ts // 1000+ lines
```

### **2. Error Handling**
```typescript
// ✅ Good: Specific error codes
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Conversation not found',
});

// ❌ Bad: Generic errors
throw new Error('Something went wrong');
```

### **3. Input Validation**
```typescript
// ✅ Good: Strict validation
const createConversationSchema = z.object({
  title: z.string().min(1).max(100),
  category: z.enum(['career-planning', 'job-search']),
});

// ❌ Bad: Loose validation
const createConversationSchema = z.object({
  title: z.string(),
  category: z.string(),
});
```

### **4. Caching Strategy**
```typescript
// ✅ Good: Appropriate cache times
const { data } = trpc.conversations.getAll.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// ❌ Bad: No caching consideration
const { data } = trpc.conversations.getAll.useQuery();
```

---

## ⚡ **Performance Considerations**

### **1. Request Batching**
- Multiple queries in one HTTP request
- Reduces network overhead
- Automatic with `httpBatchLink`

### **2. Caching Strategy**
- Use appropriate `staleTime` and `cacheTime`
- Implement optimistic updates
- Consider background refetching

### **3. Subscription Management**
- Clean up subscriptions on unmount
- Use connection pooling for WebSockets
- Implement reconnection logic

### **4. Bundle Size**
- Tree-shaking friendly
- Smaller than GraphQL
- No runtime overhead

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Type Errors:**
   - Ensure schemas match between client and server
   - Check Zod schema definitions
   - Verify TypeScript configuration

2. **Runtime Errors:**
   - Check input validation
   - Verify context creation
   - Review error handling

3. **Performance Issues:**
   - Enable request batching
   - Optimize cache settings
   - Review subscription usage

4. **Build Issues:**
   - Check Next.js configuration
   - Verify API route setup
   - Review import paths

---

## 🎯 **Key Takeaways for Interviews**

1. **tRPC provides end-to-end type safety** without code generation
2. **Excellent developer experience** with full autocomplete
3. **Built-in performance optimizations** like batching and caching
4. **Real-time capabilities** with subscriptions
5. **Framework agnostic** but works great with React Query
6. **Perfect for TypeScript projects** and internal APIs
7. **Simpler than GraphQL** for CRUD operations
8. **Better than REST** for type safety and DX

---

## 📖 **Additional Resources**

- [tRPC Documentation](https://trpc.io/docs)
- [React Query + tRPC](https://trpc.io/docs/react-query)
- [Next.js + tRPC](https://trpc.io/docs/nextjs)
- [tRPC Examples](https://github.com/trpc/examples)
- [TypeScript Best Practices](https://trpc.io/docs/typescript)

---

**This implementation demonstrates enterprise-level tRPC usage with proper architecture, type safety, and performance optimizations suitable for production applications.**
