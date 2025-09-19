 import { v4 as uuidv4 } from 'uuid';
import React from 'react';

export interface GuestSession {
  id: string;
  chatCount: number;
  maxChats: number;
  createdAt: string;
  lastUsed: string;
}

const GUEST_SESSION_KEY = 'elevare_guest_session';
const MAX_GUEST_CHATS = 5;

export class GuestSessionManager {
  private static instance: GuestSessionManager;
  
  static getInstance(): GuestSessionManager {
    if (!GuestSessionManager.instance) {
      GuestSessionManager.instance = new GuestSessionManager();
    }
    return GuestSessionManager.instance;
  }

  // Create a new guest session
  createGuestSession(): GuestSession {
    const session: GuestSession = {
      id: uuidv4(),
      chatCount: 0,
      maxChats: MAX_GUEST_CHATS,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    this.saveSession(session);
    return session;
  }

  // Get current guest session
  getGuestSession(): GuestSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(GUEST_SESSION_KEY);
      if (!sessionData) return null;
      
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Error getting guest session:', error);
      return null;
    }
  }

  // Save guest session to localStorage
  private saveSession(session: GuestSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving guest session:', error);
    }
  }

  // Check if guest can send more chats
  canSendChat(): boolean {
    const session = this.getGuestSession();
    if (!session) return true; // No session means they can start
    
    return session.chatCount < session.maxChats;
  }

  // Increment chat count
  incrementChatCount(): boolean {
    const session = this.getGuestSession();
    if (!session) return false;
    
    if (session.chatCount >= session.maxChats) {
      return false;
    }

    session.chatCount += 1;
    session.lastUsed = new Date().toISOString();
    this.saveSession(session);
    
    // Emit update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('guest-session-updated'));
    }
    
    return true;
  }

  // Get remaining chats
  getRemainingChats(): number {
    const session = this.getGuestSession();
    if (!session) return MAX_GUEST_CHATS;
    
    return Math.max(0, session.maxChats - session.chatCount);
  }

  // Check if session exists
  hasGuestSession(): boolean {
    return this.getGuestSession() !== null;
  }

  // Clear guest session
  clearGuestSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(GUEST_SESSION_KEY);
    } catch (error) {
      console.error('Error clearing guest session:', error);
    }
  }

  // Get session ID for API requests
  getSessionId(): string | null {
    const session = this.getGuestSession();
    return session?.id || null;
  }

  // Check if guest session has expired (optional - could add expiration logic)
  isSessionExpired(): boolean {
    const session = this.getGuestSession();
    if (!session) return false;
    
    // For now, sessions don't expire, but this could be extended
    // const daysSinceCreation = (Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    // return daysSinceCreation > 7; // Expire after 7 days
    
    return false;
  }
}

// Export singleton instance
export const guestSessionManager = GuestSessionManager.getInstance();

// Hook for React components
export function useGuestSession() {
  const [session, setSession] = React.useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const currentSession = guestSessionManager.getGuestSession();
    setSession(currentSession);
    setIsLoading(false);

    // Listen for guest session updates
    const handleSessionUpdate = () => {
      const updatedSession = guestSessionManager.getGuestSession();
      setSession(updatedSession);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('guest-session-updated', handleSessionUpdate);
      return () => {
        window.removeEventListener('guest-session-updated', handleSessionUpdate);
      };
    }
  }, []);

  const createSession = React.useCallback(() => {
    const newSession = guestSessionManager.createGuestSession();
    setSession(newSession);
    return newSession;
  }, []);

  const incrementChat = React.useCallback(() => {
    const success = guestSessionManager.incrementChatCount();
    if (success) {
      setSession(guestSessionManager.getGuestSession());
    }
    return success;
  }, []);

  const clearSession = React.useCallback(() => {
    guestSessionManager.clearGuestSession();
    setSession(null);
  }, []);

  return {
    session,
    isLoading,
    createSession,
    incrementChat,
    clearSession,
    canSendChat: session ? session.chatCount < session.maxChats : true,
    remainingChats: session ? Math.max(0, session.maxChats - session.chatCount) : MAX_GUEST_CHATS,
    hasSession: !!session
  };
}
