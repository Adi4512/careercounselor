"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@/types/chat';
import { useSendMessage, useChatState } from '@/hooks/use-chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  sessionId?: string;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'ai',
        content: "Hello! I'm your AI career counselor. I'm here to help with career guidance. What would you like to know?",
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      status: 'sending'
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsThinking(true);
    setIsTyping(false);

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      sender: 'ai',
      content: '',
      timestamp: new Date(),
      status: 'sending'
    };

    // Add AI message placeholder
    setMessages(prev => [...prev, aiMessage]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Update user message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
               if (data.type === 'chunk') {
                 // Switch from thinking to typing when AI starts responding
                 if (isThinking) {
                   setIsThinking(false);
                   setIsTyping(true);
                 }
                 // Update AI message with new content
                 setMessages(prev => 
                   prev.map(msg => 
                     msg.id === aiMessageId 
                       ? { ...msg, content: msg.content + data.content }
                       : msg
                   )
                 );
              } else if (data.type === 'done') {
                // Mark AI message as complete
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, status: 'sent' as const }
                      : msg
                  )
                );
              } else if (data.type === 'error') {
                // Handle error
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: data.content, status: 'sent' as const }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore parsing errors
              console.error('Parsing error:', e);

            }
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );

      // Update AI message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.", status: 'sent' as const }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-[#212121]">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isThinking && <TypingIndicator isThinking={true} />}
        {isTyping && <TypingIndicator isThinking={false} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4" style={{ backgroundColor:"#212121"  }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Let’s figure out your next step — ask me anything…"
        />
      </div>
    </div>
  );
}
