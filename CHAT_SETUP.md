# AI Career Counselor Chat Setup

## 🚀 Features Implemented

✅ **Google Authentication** - Sign in with Google OAuth
✅ **AI Chat Interface** - Real-time chat with AI career counselor
✅ **Responsive Design** - Works on desktop and mobile
✅ **Message History** - Persistent conversation during session
✅ **Typing Indicators** - Visual feedback during AI responses
✅ **Error Handling** - Graceful error management
✅ **Auto-redirect** - Redirects to chat after successful sign-in

## 📁 Project Structure

```
app/
  /chat/
    page.tsx              → Main chat page
  /api/
    /chat/
      route.ts            → AI chat API endpoint
components/
  /chat/
    ChatWindow.tsx        → Main chat interface
    MessageBubble.tsx     → Individual message component
    MessageInput.tsx      → Message input with send button
    TypingIndicator.tsx   → "AI is typing..." indicator
lib/
  ai.ts                   → AI integration (OpenAI + Together.ai + Mock)
types/
  chat.ts                 → TypeScript interfaces
```

## 🔧 Environment Variables

Create a `.env.local` file with these variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI APIs (Optional - will use mock responses if not provided)
OPENROUTER_API_KEY="sk-or-your-openrouter-key"
```

## 🤖 AI Integration

The chat system uses OpenRouter for AI responses:

1. **OpenRouter** (Primary) - Requires `OPENROUTER_API_KEY`
2. **Mock Responses** (Fallback) - Works without API keys

### AI Features:
- **Streaming Responses** - Real-time text generation
- **Career Counseling Specialization** - Expert career advice
- **Conversation Context Awareness** - Remembers chat history
- **Error Handling and Fallbacks** - Graceful error management
- **Token Usage Tracking** - Monitor API usage
- **OpenRouter Integration** - Access to multiple AI models

### Supported Models:
- **Llama 3.1 8B** (Default) - Fast and efficient
- **Other OpenRouter Models** - Easily configurable

## 🎨 UI Components

### ChatWindow
- Full-screen chat interface
- **Streaming message display** - Real-time text generation
- Message history display
- Auto-scroll to latest messages
- Loading states and error handling

### MessageBubble
- User vs AI message styling
- Timestamps and status indicators
- Responsive design
- Smooth animations

### MessageInput
- Auto-resizing textarea
- Send on Enter key
- Loading states
- Character limits

### TypingIndicator
- Animated dots
- AI avatar
- "AI is thinking..." text

## 🚀 Getting Started

1. **Set up environment variables** (see above)
2. **Configure Google OAuth** in Google Cloud Console
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Visit** `http://localhost:3000`
5. **Sign in** with Google
6. **Start chatting** with the AI career counselor!

## 🔄 User Flow

1. **Landing Page** → User sees "Unlock Your Future" button
2. **Sign In** → Google OAuth authentication
3. **Redirect** → Automatically redirected to `/chat`
4. **Chat Interface** → Start conversation with AI
5. **AI Responses** → Get personalized career advice

## 🛠 Customization

### Adding New AI Providers
Edit `lib/ai.ts` to add new AI service integrations.

### Styling
All components use Tailwind CSS classes and can be customized in their respective files.

### Message Types
Extend the `Message` interface in `types/chat.ts` to add new message types.

## 🐛 Troubleshooting

### Common Issues:
1. **Sign-in not working** - Check Google OAuth configuration
2. **AI not responding** - Check API keys and network connection
3. **Messages not loading** - Check browser console for errors
4. **Styling issues** - Ensure Tailwind CSS is properly configured

### Debug Mode:
- Check browser console for detailed error messages
- AI responses include model and token usage information
- Network tab shows API request/response details

## 📱 Mobile Support

The chat interface is fully responsive and optimized for mobile devices:
- Touch-friendly message input
- Swipe gestures
- Mobile-optimized layouts
- Responsive typography

## 🔒 Security

- All API routes require authentication
- User sessions are managed by NextAuth
- AI API keys are server-side only
- Input validation and sanitization
- Error message sanitization
