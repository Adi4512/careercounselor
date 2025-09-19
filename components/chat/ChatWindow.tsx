"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import GuestLimitModal from './GuestLimitModal';
import { useChatMessages, useSendMessage } from '@/hooks/use-trpc-chat';
import { useCreateConversation } from '@/hooks/use-trpc-conversations';
import { GuestSession, guestSessionManager } from '@/lib/guest-session';

interface ChatWindowProps {
  conversationId: string | null;
  onConversationCreate?: (id: string) => void;
  guestSession?: GuestSession | null;
  remainingChats?: number;
}

export default function ChatWindow({ conversationId, onConversationCreate, guestSession, remainingChats }: ChatWindowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auth session
  const { data: session } = useSession();
  
  // tRPC hooks - only fetch messages if we have a conversation ID
  const { data: messagesData, refetch } = useChatMessages(
    conversationId || 'skip', // Use 'skip' to prevent query when no conversation
    50,
    { enabled: !!conversationId } // Only enable query when conversationId exists
  );
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  
  // Local state for typing effect
  const [typingContent, setTypingContent] = useState('');
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  
  // Flatten messages from infinite query or use guest messages
  const messages = guestSession 
    ? guestMessages 
    : (conversationId ? (messagesData?.pages.flatMap(page => page.items) || []).map(msg => ({
        id: msg.id,
        sender: msg.role as 'user' | 'ai',
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        status: 'sent' as const
      })) : []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    // Handle guest session
    if (guestSession) {
      // Check if guest has reached limit
      if (!guestSessionManager.canSendChat()) {
        setShowGuestLimitModal(true);
        return;
      }

      setIsLoading(true);
      setIsThinking(true);
      
      // Add user message to guest messages
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content,
        timestamp: new Date(),
        status: 'sent'
      };
      setGuestMessages(prev => [...prev, userMessage]);

      try {
        setIsTypingResponse(true);
        setTypingContent('');
        
        // Call guest API
        const response = await fetch('/api/chat/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            history: guestMessages.map(msg => ({
              sender: msg.sender,
              content: msg.content,
              timestamp: msg.timestamp.toISOString()
            })),
            guestSessionId: guestSession.id
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            setShowGuestLimitModal(true);
            return;
          }
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        
        // Simulate typing effect
        const words = data.message.split(' ');
        for (let i = 0; i < words.length; i++) {
          setTypingContent(prev => prev + (i > 0 ? ' ' : '') + words[i]);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Add AI response to guest messages
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: data.message,
          timestamp: new Date(),
          status: 'sent'
        };
        setGuestMessages(prev => [...prev, aiMessage]);
        
        // Update local guest session count
        guestSessionManager.incrementChatCount();
        
      } catch (error) {
        console.error('Error sending guest message:', error);
        // Remove the user message if there was an error
        setGuestMessages(prev => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
        setIsThinking(false);
        setIsTypingResponse(false);
        setTypingContent('');
      }
      return;
    }

    // Handle authenticated user (existing logic)
    let currentConversationId = conversationId;
    
    // Create conversation if none exists, using first message as title
    if (!currentConversationId) {
      try {
        // Create title from first message (10-15 characters)
        const titleLength = Math.min(15, Math.max(10, content.length));
        let title = content.slice(0, titleLength);
        
        // If we cut off mid-word, find the last complete word
        if (content.length > titleLength) {
          const lastSpaceIndex = title.lastIndexOf(' ');
          if (lastSpaceIndex > 8) { // Keep at least 8 chars
            title = title.slice(0, lastSpaceIndex);
          }
          title += '...';
        }
        
        const newConversation = await createConversation.mutateAsync({ title });
        currentConversationId = newConversation.id;
        onConversationCreate?.(newConversation.id);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        return;
      }
    }
    
    setIsLoading(true);
    setIsThinking(true);
    
    try {
      setIsTypingResponse(true);
      setTypingContent('');
      
      // Send message and get response
      const response = await sendMessage.mutateAsync({
        message: content,
        conversationId: currentConversationId,
      });
      
      // Get the response content but don't show it yet
      const fullResponse = response.aiMessage.content;
      
      // Clear the response from database temporarily by not refetching yet
      // Simulate typing effect by revealing the response gradually
      const words = fullResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        setTypingContent(prev => prev + (i > 0 ? ' ' : '') + words[i]);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between words
      }
      
      // Clear typing state and show the final message
      setIsTypingResponse(false);
      setTypingContent('');
      refetch();
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTypingResponse(false);
      setTypingContent('');
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setIsTyping(false);
      // Don't clear typing state here - let the typing completion handle it
    }
  };

  // Messages are now in the correct format for both guest and database
  const uiMessages = messages;
  
  // Check if we have a temporary AI message (thinking state) - only for database messages
  const hasThinkingMessage = !guestSession && messages.some(msg => 
    msg.id.startsWith('temp-ai-') && msg.content === '...'
  );
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-[#212121] w-full">
        {uiMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
            ✨ Salve <span className="font-semibold text-gray-300">{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}</span>!
            </div>
            <div className="text-gray-300">Ready to plan your career journey? Let's start the conversation.</div>
          </div>
        )}
        {uiMessages.filter(msg => {
          // Hide temp messages
          if (msg.id.startsWith('temp-ai-') && msg.content === '...') return false;
          // Hide the most recent AI message while typing (the one being replaced by typing effect)
          if (isTypingResponse && msg.sender === 'ai' && msg === uiMessages[uiMessages.length - 1]) return false;
          return true;
        }).map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTypingResponse && typingContent && (
          <div className="flex justify-start">
            <div className="bg-[#303030] rounded-lg p-3 max-w-xs lg:max-w-md">
              <p className="text-white text-sm">{typingContent}</p>
              <div className="flex items-center mt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {(isThinking || hasThinkingMessage || sendMessage.isPending) && <TypingIndicator isThinking={true} />}
        {isTyping && <TypingIndicator isThinking={false} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 w-full bg-[#212121]">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || sendMessage.isPending}
          placeholder="Let's figure out your next step — ask me anything…"
        />
      </div>

      {/* Guest Limit Modal */}
      <GuestLimitModal
        isOpen={showGuestLimitModal}
        onClose={() => setShowGuestLimitModal(false)}
        chatsUsed={guestSession?.chatCount || 0}
        maxChats={guestSession?.maxChats || 5}
      />
    </div>
  );
}
