"use client";

import { Message } from '@/types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* {!isUser && (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-gray-300 flex-shrink-0 mt-1">
            AI
          </div>
        )} */}
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <div
            className={`inline-block px-4 py-3 rounded-2xl bg-[#303030] text-white`}
            style={{
              boxShadow: isUser ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className={`flex items-center mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {(() => {
                try {
                  const date = message.timestamp instanceof Date 
                    ? message.timestamp 
                    : new Date(message.timestamp);
                  
                  if (isNaN(date.getTime())) {
                    return 'now';
                  }
                  
                  return format(date, 'HH:mm');
                } catch (error) {
                  return 'now';
                }
              })()}
            </span>
            {isUser && message.status && (
              <span className="text-xs text-gray-400 ml-2">
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
  );
}
