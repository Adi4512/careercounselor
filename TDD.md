# Technical Specification: Oration AI Career Counseling Chat App

## Project Overview

Build a comprehensive Career Counseling Chat Application using Next.js, TypeScript, tRPC, TanStack Query, and AI integration. The app provides users with AI-powered career counseling through persistent chat sessions with full authentication, session management, and real-time messaging capabilities.

## Key Goals (All Mandatory)

- Full-stack Next.js app with TypeScript (strict mode)
- Scalable backend with tRPC + database ORM
- Complete user authentication system with NextAuth
- Persistent chat history with session management
- Real-time AI integration for career counseling responses
- Production deployment on Vercel with Supabase database
- Responsive design with dark/light theme support
- Optimistic UI with TanStack Query
- Typing indicators and message status tracking

## 🏗 Tech Stack (All Required)

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- ShadCN/UI components
- Tailwind CSS
- TanStack Query v5
- NextAuth.js for authentication
- React Hook Form for form handling
- Zod for validation

**Backend:**
- tRPC v11
- Drizzle ORM
- PostgreSQL (Supabase)
- NextAuth.js (server-side)

**AI Integration:**
- OpenAI GPT-4 API
- Fallback: Together.ai API

**Deployment:**
- Vercel (frontend + backend)
- Supabase (database + auth)
- Environment variables management

**Additional Libraries:**
- @tanstack/react-query
- @trpc/client, @trpc/server, @trpc/next
- drizzle-orm, @libsql/client
- next-auth
- lucide-react (icons)
- clsx, tailwind-merge (styling utilities)

## 📂 Project Structure (Complete Implementation)

```
/src
  /app
    /(auth)
      /login            → Login page
      /register         → Registration page
    /chat
      /[sessionId]      → Individual chat session page
      /new              → Start new chat page
      /page.tsx         → Chat sessions list
    /api
      /auth/[...nextauth] → NextAuth API routes
      /trpc/[trpc]      → tRPC API handler
    /globals.css        → Global styles + theme variables
    /layout.tsx         → Root layout with providers
    /page.tsx           → Landing page
  /components
    /ui                 → ShadCN/UI components
      /button.tsx
      /input.tsx
      /textarea.tsx
      /card.tsx
      /dialog.tsx
      /toast.tsx
      /theme-toggle.tsx
    /auth
      /LoginForm.tsx    → Login form component
      /RegisterForm.tsx → Registration form component
    /chat
      /ChatWindow.tsx   → Main chat interface
      /ChatHistory.tsx  → Sidebar with past sessions
      /MessageBubble.tsx → Individual message component
      /MessageInput.tsx → Message input with send button
      /TypingIndicator.tsx → "AI is typing..." indicator
      /SessionCard.tsx  → Individual session card
    /layout
      /Header.tsx       → App header with auth
      /Sidebar.tsx      → Collapsible sidebar
      /ThemeProvider.tsx → Theme context provider
  /server
    /routers
      /auth.ts          → Authentication routes
      /chat.ts          → Chat operations (send, fetch, history)
      /user.ts          → User management routes
    /db
      /schema.ts        → Drizzle schema definitions
      /index.ts         → Database connection
      /migrations       → Database migration files
  /lib
    /ai.ts              → AI API client (OpenAI + fallback)
    /auth.ts            → NextAuth configuration
    /db.ts              → Database client
    /trpc.ts            → tRPC client/server setup
    /utils.ts           → Utility functions
    /validations.ts     → Zod schemas
  /types
    /auth.ts            → Authentication types
    /chat.ts            → Chat-related types
    /database.ts        → Database types
```

## 🗄 Database Schema (Complete Implementation)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  email_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Chat Sessions Table
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'New Session',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes (Performance Optimization)
```sql
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_session_created ON messages(session_id, created_at);
```

## 🔌 Backend (tRPC Routers - Complete Implementation)

### Authentication Router (`/server/routers/auth.ts`)
```typescript
export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  
  signIn: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      // NextAuth signIn logic
    }),
    
  signUp: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      // User registration logic
    }),
    
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    // NextAuth signOut logic
  })
});
```

### Chat Router (`/server/routers/chat.ts`)
```typescript
export const chatRouter = createTRPCRouter({
  // Create new chat session
  createSession: protectedProcedure
    .input(z.object({
      title: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const session = await ctx.db.insert(chatSessions).values({
        userId: ctx.session.user.id,
        title: input.title || 'New Session'
      }).returning();
      return session[0];
    }),
    
  // Get all sessions for user
  getSessions: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      const sessions = await ctx.db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.userId, ctx.session.user.id))
        .orderBy(desc(chatSessions.createdAt))
        .limit(input.limit);
      return sessions;
    }),
    
  // Get messages for a session
  getMessages: protectedProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      // Verify session belongs to user
      const session = await ctx.db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, input.sessionId),
          eq(chatSessions.userId, ctx.session.user.id)
        ))
        .limit(1);
        
      if (!session[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      
      const messages = await ctx.db
        .select()
        .from(messages)
        .where(eq(messages.sessionId, input.sessionId))
        .orderBy(asc(messages.createdAt))
        .limit(input.limit);
        
      return messages;
    }),
    
  // Send message and get AI response
  sendMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
      content: z.string().min(1).max(4000)
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify session belongs to user
      const session = await ctx.db
        .select()
        .from(chatSessions)
        .where(and(
          eq(chatSessions.id, input.sessionId),
          eq(chatSessions.userId, ctx.session.user.id)
        ))
        .limit(1);
        
      if (!session[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      
      // Save user message
      const userMessage = await ctx.db
        .insert(messages)
        .values({
          sessionId: input.sessionId,
          sender: 'user',
          content: input.content,
          status: 'sent'
        })
        .returning();
        
      // Get AI response
      const aiResponse = await getCareerCounselingResponse(
        input.sessionId,
        input.content,
        ctx.db
      );
      
      // Save AI response
      const aiMessage = await ctx.db
        .insert(messages)
        .values({
          sessionId: input.sessionId,
          sender: 'ai',
          content: aiResponse,
          status: 'sent'
        })
        .returning();
        
      return {
        userMessage: userMessage[0],
        aiMessage: aiMessage[0]
      };
    }),
    
  // Update session title
  updateSessionTitle: protectedProcedure
    .input(z.object({
      sessionId: z.string().uuid(),
      title: z.string().min(1).max(255)
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership and update
      const updated = await ctx.db
        .update(chatSessions)
        .set({ title: input.title })
        .where(and(
          eq(chatSessions.id, input.sessionId),
          eq(chatSessions.userId, ctx.session.user.id)
        ))
        .returning();
        
      if (!updated[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return updated[0];
    }),
    
  // Delete session
  deleteSession: protectedProcedure
    .input(z.object({
      sessionId: z.string().uuid()
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership and delete
      const deleted = await ctx.db
        .delete(chatSessions)
        .where(and(
          eq(chatSessions.id, input.sessionId),
          eq(chatSessions.userId, ctx.session.user.id)
        ))
        .returning();
        
      if (!deleted[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      return { success: true };
    })
});
```

### User Router (`/server/routers/user.ts`)
```typescript
export const userRouter = createTRPCRouter({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),
  
  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(255).optional(),
      email: z.string().email().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Update user profile logic
    }),
  
  // Get user statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const sessionCount = await ctx.db
      .select({ count: count() })
      .from(chatSessions)
      .where(eq(chatSessions.userId, ctx.session.user.id));
      
    const messageCount = await ctx.db
      .select({ count: count() })
      .from(messages)
      .innerJoin(chatSessions, eq(messages.sessionId, chatSessions.id))
      .where(eq(chatSessions.userId, ctx.session.user.id));
      
    return {
      sessionCount: sessionCount[0]?.count || 0,
      messageCount: messageCount[0]?.count || 0
    };
  })
});
```

## 🎨 Frontend Features (Complete Implementation)

### Authentication Pages
- **Login Page** (`/login`): Email/password login with form validation
- **Register Page** (`/register`): User registration with email verification
- **Protected Routes**: All chat pages require authentication
- **Session Management**: Automatic token refresh and logout on expiry

### Chat Interface
- **Real-time Messaging**: Instant message sending with optimistic updates
- **Message Bubbles**: Distinct styling for user vs AI messages
- **Timestamps**: Display message time with relative formatting
- **Message Status**: Visual indicators for sending/sent/delivered/failed
- **Typing Indicator**: "AI is typing..." animation during response generation
- **Auto-scroll**: Automatic scroll to latest message
- **Message Actions**: Copy, edit (user messages), delete functionality

### Chat Session Management
- **Session Sidebar**: Collapsible list of all chat sessions
- **Session Cards**: Display title, last message preview, timestamp
- **New Chat Button**: Quick access to start new conversations
- **Session Search**: Filter sessions by title or content
- **Session Actions**: Rename, delete, archive sessions
- **Recent Sessions**: Quick access to last 5 conversations

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Collapsible Sidebar**: Hamburger menu on mobile
- **Touch Gestures**: Swipe to navigate between sessions
- **Adaptive Layout**: Desktop split-view, mobile stacked layout
- **Keyboard Navigation**: Full keyboard accessibility support

### Theme System
- **Dark/Light Mode**: Toggle with system preference detection
- **Theme Persistence**: User preference saved in localStorage
- **Smooth Transitions**: Animated theme switching
- **Custom Colors**: Brand-consistent color palette

### Advanced UI Features
- **Loading States**: Skeleton loaders for all async operations
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Success/error feedback for user actions
- **Confirmation Dialogs**: Safe deletion and destructive actions
- **Infinite Scroll**: Paginated message loading for long conversations

## 🤖 AI Integration (Complete Implementation)

### AI Service (`/lib/ai.ts`)
```typescript
interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  createdAt: Date;
}

interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

export class CareerCounselingAI {
  private openai: OpenAI;
  private fallbackClient: TogetherAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.fallbackClient = new TogetherAI({
      apiKey: process.env.TOGETHER_API_KEY
    });
  }
  
  async getCareerCounselingResponse(
    sessionId: string,
    userMessage: string,
    messageHistory: Message[],
    db: Database
  ): Promise<AIResponse> {
    try {
      // Get last 10 messages for context
      const recentMessages = messageHistory.slice(-10);
      
      // Build conversation context
      const conversationContext = this.buildConversationContext(recentMessages);
      
      // Generate AI response with OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert career counselor with 15+ years of experience. 
            Provide personalized, actionable advice for career development, job searching, 
            skill building, and professional growth. Be empathetic, encouraging, and specific. 
            Ask clarifying questions when needed. Keep responses concise but comprehensive.`
          },
          ...conversationContext,
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });
      
      return {
        content: response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.',
        tokensUsed: response.usage?.total_tokens || 0,
        model: 'gpt-4'
      };
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fallback to Together.ai
      try {
        return await this.getFallbackResponse(userMessage, messageHistory);
      } catch (fallbackError) {
        console.error('Fallback AI error:', fallbackError);
        throw new Error('AI service temporarily unavailable');
      }
    }
  }
  
  private buildConversationContext(messages: Message[]): Array<{role: string, content: string}> {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }
  
  private async getFallbackResponse(
    userMessage: string, 
    messageHistory: Message[]
  ): Promise<AIResponse> {
    const response = await this.fallbackClient.chat.completions.create({
      model: 'meta-llama/Llama-2-70b-chat-hf',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful career counselor. Provide practical career advice.'
        },
        ...this.buildConversationContext(messageHistory.slice(-5)),
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });
    
    return {
      content: response.choices[0]?.message?.content || 'Unable to generate response.',
      tokensUsed: response.usage?.total_tokens || 0,
      model: 'llama-2-70b'
    };
  }
}

export const careerAI = new CareerCounselingAI();
```

### AI Features
- **Context Awareness**: Maintains conversation history for coherent responses
- **Career Specialization**: Trained prompts for career counseling scenarios
- **Response Streaming**: Real-time response generation (if supported)
- **Token Management**: Efficient context window usage
- **Error Recovery**: Graceful fallback to alternative AI providers
- **Response Validation**: Content filtering and safety checks

## 🚀 Deployment Steps (Complete Implementation)

### 1. Repository Setup
- [ ] Initialize Git repository with proper `.gitignore`
- [ ] Push to GitHub (public repository)
- [ ] Set up branch protection rules
- [ ] Configure GitHub Actions for CI/CD

### 2. Database Setup (Supabase)
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure database connection pooling
- [ ] Set up database backups

### 3. Environment Configuration
Create `.env.local` file with all required variables:
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI APIs
OPENAI_API_KEY="sk-..."
TOGETHER_API_KEY="your-together-key"

# Optional: Email (for notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings (Next.js framework)
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy to production
- [ ] Configure custom domain (optional)

### 5. Production Testing Checklist
- [ ] User registration and login
- [ ] Create new chat sessions
- [ ] Send messages and receive AI responses
- [ ] View chat history
- [ ] Session management (rename, delete)
- [ ] Theme switching
- [ ] Mobile responsiveness
- [ ] Error handling and recovery
- [ ] Performance optimization

### 6. Monitoring and Analytics
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry)
- [ ] Database performance monitoring
- [ ] AI API usage tracking
- [ ] User engagement metrics

## 📝 Documentation Requirements (Complete Implementation)

### README.md Structure
```markdown
# Oration AI Career Counseling Chat App

## 🚀 Quick Start
- Live Demo: [https://your-app.vercel.app](https://your-app.vercel.app)
- Tech Stack: Next.js 14, TypeScript, tRPC, Supabase, OpenAI

## 📋 Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- OpenAI API key

## 🛠 Local Development

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/career-counselor.git
cd career-counselor
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Database Setup
```bash
# Run migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed
```

### 5. Start Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure
[Detailed project structure explanation]

## 🔧 Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open database studio

## 🌐 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment
[Detailed deployment instructions]

## 🔐 Environment Variables
[Complete list with descriptions]

## 📱 Features
- [Complete feature list with screenshots]

## 🤝 Contributing
[Contribution guidelines]

## 📄 License
[MIT License]

## 🆘 Support
[Support and contact information]
```

### Additional Documentation Files
- [ ] `CONTRIBUTING.md` - Contribution guidelines
- [ ] `CHANGELOG.md` - Version history
- [ ] `API.md` - API documentation
- [ ] `DEPLOYMENT.md` - Detailed deployment guide
- [ ] `TROUBLESHOOTING.md` - Common issues and solutions

### Screenshots and Demo
- [ ] Landing page screenshot
- [ ] Chat interface (desktop and mobile)
- [ ] Authentication pages
- [ ] Session management
- [ ] Theme switching demo
- [ ] Video walkthrough (optional)

## 🔒 Security Requirements (All Mandatory)

### Authentication Security
- [ ] JWT token validation
- [ ] Session timeout handling
- [ ] Password hashing (bcrypt)
- [ ] CSRF protection
- [ ] Rate limiting on auth endpoints

### Data Protection
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Content Security Policy (CSP)
- [ ] HTTPS enforcement

### API Security
- [ ] tRPC input validation
- [ ] Rate limiting per user
- [ ] API key rotation
- [ ] Error message sanitization
- [ ] Request logging and monitoring

## 📊 Performance Requirements (All Mandatory)

### Frontend Performance
- [ ] Core Web Vitals optimization
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Bundle size optimization

### Backend Performance
- [ ] Database query optimization
- [ ] Connection pooling
- [ ] Caching strategy
- [ ] Response compression
- [ ] CDN integration

### AI Performance
- [ ] Response time optimization
- [ ] Token usage monitoring
- [ ] Fallback mechanisms
- [ ] Caching frequent responses
- [ ] Rate limiting AI requests

## 🧪 Testing Requirements (All Mandatory)

### Unit Tests
- [ ] Component testing (React Testing Library)
- [ ] Utility function testing
- [ ] API route testing
- [ ] Database operation testing

### Integration Tests
- [ ] Authentication flow testing
- [ ] Chat functionality testing
- [ ] AI integration testing
- [ ] Database integration testing

### End-to-End Tests
- [ ] User registration and login
- [ ] Complete chat session flow
- [ ] Session management
- [ ] Mobile responsiveness

### Performance Tests
- [ ] Load testing
- [ ] Database performance testing
- [ ] AI API response time testing
- [ ] Memory usage monitoring