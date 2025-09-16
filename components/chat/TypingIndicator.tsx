"use client";

interface TypingIndicatorProps {
  isThinking?: boolean;
}

export default function TypingIndicator({ isThinking = true }: TypingIndicatorProps) {
  if (isThinking) {
    // Show pulsating white dot when AI is thinking
    return (
      <div className="flex justify-start mb-6">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Show typing indicator when AI is actually typing
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-3 max-w-[80%]">
        <div className="flex-1">
          <div className="inline-block px-4 py-3 rounded-full bg-[#303030]" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
