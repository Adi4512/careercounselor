import { NextRequest, NextResponse } from 'next/server';
import { careerAI } from '@/lib/ai';
import { Message } from '@/types/chat';

// In-memory store for guest session chat counts
// In production, you might want to use Redis or a database
const guestChatCounts = new Map<string, { count: number; lastUsed: Date }>();
const MAX_GUEST_CHATS = 5;
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up old sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [sessionId, data] of guestChatCounts.entries()) {
    if (now.getTime() - data.lastUsed.getTime() > CLEANUP_INTERVAL) {
      guestChatCounts.delete(sessionId);
    }
  }
}, CLEANUP_INTERVAL);

export async function POST(request: NextRequest) {
  try {
    const { message, history, guestSessionId } = await request.json();

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!guestSessionId || typeof guestSessionId !== 'string') {
      return NextResponse.json(
        { error: 'Guest session ID is required' },
        { status: 400 }
      );
    }

    // Check guest session limits
    const sessionData = guestChatCounts.get(guestSessionId) || { count: 0, lastUsed: new Date() };
    
    if (sessionData.count >= MAX_GUEST_CHATS) {
      return NextResponse.json(
        { error: 'Guest chat limit exceeded', limit: MAX_GUEST_CHATS, used: sessionData.count },
        { status: 429 }
      );
    }

    // Increment chat count
    sessionData.count += 1;
    sessionData.lastUsed = new Date();
    guestChatCounts.set(guestSessionId, sessionData);

    // Convert history to Message format
    const messageHistory: Message[] = (history || []).map((msg: { id?: string; sender: string; content: string; timestamp?: string | number; status?: string }) => {
      let timestamp: Date;
      try {
        timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
        // Validate the date
        if (isNaN(timestamp.getTime())) {
          timestamp = new Date();
        }
      } catch (error) {
        timestamp = new Date();
      }

      return {
        id: msg.id || Math.random().toString(),
        sender: msg.sender as 'user' | 'ai',
        content: msg.content,
        timestamp,
        status: msg.status as 'sending' | 'sent' | 'delivered' | 'failed' || 'sent'
      };
    });

    // Get AI response
    const aiResponse = await careerAI.getCareerCounselingResponse(
      message,
      messageHistory
    );

    return NextResponse.json({
      message: aiResponse.content,
      timestamp: new Date().toISOString(),
      model: aiResponse.model,
      tokensUsed: aiResponse.tokensUsed,
      remainingChats: MAX_GUEST_CHATS - sessionData.count,
      totalChats: sessionData.count
    });

  } catch (error) {
    console.error('Guest Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check remaining chats
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const guestSessionId = url.searchParams.get('sessionId');

    if (!guestSessionId) {
      return NextResponse.json(
        { error: 'Guest session ID is required' },
        { status: 400 }
      );
    }

    const sessionData = guestChatCounts.get(guestSessionId) || { count: 0, lastUsed: new Date() };
    
    return NextResponse.json({
      remainingChats: MAX_GUEST_CHATS - sessionData.count,
      totalChats: sessionData.count,
      maxChats: MAX_GUEST_CHATS
    });

  } catch (error) {
    console.error('Guest Chat API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
