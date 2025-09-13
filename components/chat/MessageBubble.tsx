"use client";

import { Message } from '@/types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const isAITyping = message.status === 'sending';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-white'
        }`}
      >
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1">
              AI
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">
                {format(new Date(message.timestamp), 'HH:mm')}
              </span>
              {isUser && message.status && (
                <span className="text-xs opacity-70 ml-2">
                  {message.status === 'sending' && 'Sending...'}
                  {message.status === 'sent' && '✓'}
                  {message.status === 'delivered' && '✓✓'}
                  {message.status === 'failed' && '✗'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
