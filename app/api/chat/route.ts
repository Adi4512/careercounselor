import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { careerAI } from '@/lib/ai';
import { Message } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Convert history to Message format
    const messageHistory: Message[] = (history || []).map((msg: any) => ({
      id: msg.id || Math.random().toString(),
      sender: msg.sender,
      content: msg.content,
      timestamp: new Date(msg.timestamp || Date.now()),
      status: msg.status || 'sent'
    }));

    // Get AI response
    const aiResponse = await careerAI.getCareerCounselingResponse(
      message,
      messageHistory
    );

    return NextResponse.json({
      message: aiResponse.content,
      timestamp: new Date().toISOString(),
      model: aiResponse.model,
      tokensUsed: aiResponse.tokensUsed
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
