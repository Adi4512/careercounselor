import { NextRequest } from 'next/server';
import { careerAI } from '@/lib/ai';
import { Message } from '@/types/chat';

// In-memory store for guest session chat counts (shared with the main guest route)
const guestChatCounts = new Map<string, { count: number; lastUsed: Date }>();
const MAX_GUEST_CHATS = 5;

export async function POST(request: NextRequest) {
  try {
    const { message, history, guestSessionId } = await request.json();

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }

    if (!guestSessionId || typeof guestSessionId !== 'string') {
      return new Response('Guest session ID is required', { status: 400 });
    }

    // Check guest session limits
    const sessionData = guestChatCounts.get(guestSessionId) || { count: 0, lastUsed: new Date() };
    
    if (sessionData.count >= MAX_GUEST_CHATS) {
      return new Response(
        JSON.stringify({ error: 'Guest chat limit exceeded', limit: MAX_GUEST_CHATS, used: sessionData.count }), 
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
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

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();
          
          // Send metadata first
          const metadata = {
            type: 'metadata',
            remainingChats: MAX_GUEST_CHATS - sessionData.count,
            totalChats: sessionData.count
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(metadata)}\n\n`));
          
          // Get streaming AI response
          for await (const chunk of careerAI.getCareerCounselingStream(message, messageHistory)) {
            const data = {
              type: 'content',
              content: chunk
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          }
          
          // Send final metadata
          const finalData = {
            type: 'done',
            remainingChats: MAX_GUEST_CHATS - sessionData.count,
            totalChats: sessionData.count
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`));
          
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = {
            type: 'error',
            error: 'Internal server error'
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(errorData)}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Guest Chat Stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
