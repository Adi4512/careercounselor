import { AIResponse, Message } from '@/types/chat';

export class CareerCounselingAI {
  private openrouterApiKey: string;

  constructor() {
    this.openrouterApiKey = process.env.OPENROUTER_API_KEY || '';
  }

  async getCareerCounselingResponse(
    userMessage: string,
    messageHistory: Message[]
  ): Promise<AIResponse> {
    try {
      // Use OpenRouter
      if (this.openrouterApiKey) {
        return await this.getOpenRouterResponse(userMessage, messageHistory);
      }
      
      // If no API key, return a mock response
      return this.getMockResponse();
    } catch (error) {
      console.error('AI API error:', error);
      return this.getMockResponse();
    }
  }

  async *getCareerCounselingStream(
    userMessage: string,
    messageHistory: Message[]
  ): AsyncGenerator<string, void, unknown> {
    try {
      if (this.openrouterApiKey) {
        yield* this.getOpenRouterStream(userMessage, messageHistory);
      } else {
        // If no API key, return mock response as stream
        const mockResponse = this.getMockResponse();
        const words = mockResponse.content.split(' ');
        for (const word of words) {
          yield word + ' ';
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming
        }
      }
    } catch (error) {
      console.error('AI streaming error:', error);
      const errorResponse = "I apologize, but I'm having trouble responding right now. Please try again in a moment.";
      const words = errorResponse.split(' ');
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }

  private async getOpenRouterResponse(
    userMessage: string,
    messageHistory: Message[]
  ): Promise<AIResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Elevare AI Career Counselor'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1',
        messages: [
          {
            role: 'system',
            content: `You are a professional career counselor. Your role is to:

            - Answer ONLY the specific question asked
            - Keep responses concise and focused (2-3 sentences max)
            - Be direct and practical
            - Wait for follow-up questions before providing more details
            - Use a professional, supportive tone
            - Avoid lengthy explanations unless specifically requested
            
            Guidelines:
            - If asked about career paths, give 2-3 specific options
            - If asked about skills, list 3-5 key skills
            - If asked about job search, give 2-3 actionable steps
            - Always end with "What would you like to know more about?"`
          },
          ...this.buildConversationContext(messageHistory.slice(-10)),
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.',
      tokensUsed: data.usage?.total_tokens || 0,
      model: 'deepseek/deepseek-chat-v3.1'
    };
  }

  private async *getOpenRouterStream(
    userMessage: string,
    messageHistory: Message[]
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Elevare AI Career Counselor'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3.1',
        messages: [
          {
            role: 'system',
            content: `You are a professional career counselor. Your role is to:

            - Answer ONLY the specific question asked
            - Keep responses concise and focused (2-3 sentences max)
            - Be direct and practical
            - Wait for follow-up questions before providing more details
            - Use a professional, supportive tone
            - Avoid lengthy explanations unless specifically requested
            
            Guidelines:
            - If asked about career paths, give 2-3 specific options
            - If asked about skills, list 3-5 key skills
            - If asked about job search, give 2-3 actionable steps`
          },
          ...this.buildConversationContext(messageHistory.slice(-10)),
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
              console.error('Parsing error:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private getMockResponse(): AIResponse {
    const responses = [
      "I'd be happy to help with your career question. What specific guidance are you looking for?",
      "That's a great question. What are your main career goals right now?",
      "I can help with career advice. What's your current situation?",
      "Career decisions can be challenging. What aspect would you like to discuss?",
      "I'd love to help with your career development. What changes are you considering?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse,
      model: 'mock'
    };
  }

  private buildConversationContext(messages: Message[]): Array<{role: string, content: string}> {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }
}

export const careerAI = new CareerCounselingAI();
