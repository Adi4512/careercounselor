"use client";

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Ask me anything about your career..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 bg-[#2d2d2d] text-white rounded-2xl resize-none min-h-[52px] max-h-[200px] placeholder-white/80   focus:outline-none  transition-colors"
            rows={1}
            style={{ 
              fontSize: '16px',
              lineHeight: '24px'
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white transition-colors rounded-xl flex items-center justify-center group"
            style={{ 
              width: '32px', 
              height: '32px'
            }}
          >
            <svg
              className="w-4 h-4 text-black  group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
