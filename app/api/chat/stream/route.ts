import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { careerAI } from '@/lib/ai';
import { Message } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response('Message is required', { status: 400 });
    }

    // Convert history to Message format
    const messageHistory: Message[] = (history || []).map((msg: { id?: string; sender: string; content: string; timestamp?: string | number; status?: string }) => ({
      id: msg.id || Math.random().toString(),
      sender: msg.sender,
      content: msg.content,
      timestamp: new Date(msg.timestamp || Date.now()),
      status: msg.status || 'sent'
    }));

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`));

          // Stream AI response
          for await (const chunk of careerAI.getCareerCounselingStream(message, messageHistory)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`));
          }

          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: 'An error occurred while generating the response.' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Chat stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
