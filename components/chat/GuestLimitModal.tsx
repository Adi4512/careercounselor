"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatsUsed: number;
  maxChats: number;
}

export default function GuestLimitModal({ isOpen, onClose, chatsUsed, maxChats }: GuestLimitModalProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/chat',
        redirect: false 
      });
      
      if (result?.ok) {
        // Redirect to chat page after successful sign in
        window.location.href = '/chat';
      } else {
        console.error('Sign in failed:', result?.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#181818] rounded-lg border border-gray-600 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Guest Limit Reached</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-300 mb-2">
              You've used all <span className="font-semibold text-white">{maxChats} guest chats</span>.
            </p>
            <p className="text-sm text-gray-400">
              Sign in to continue chatting with unlimited conversations and save your chat history.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-[#212121] rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-white mb-3">With a free account, you get:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Unlimited conversations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Save and access chat history
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Personalized career guidance
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Advanced AI features
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-[#303030] transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                'Sign In with Google'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
