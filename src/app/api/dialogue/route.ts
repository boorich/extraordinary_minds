import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000, // 10 second timeout
  maxRetries: 2
});

const SYSTEM_PROMPT = `You are an advanced AI system called Neural Odyssey engaging in a 10-round conversation to discover exceptional individuals. Keep responses concise and focused.

KEY GUIDELINES:
- Each response should acknowledge the user's previous answer with a quick transition to a new question
- Maintain an engaging but brief tone
- Questions should reveal the person's excellence in any field
- Keep it conversational but concise
- After round 10, briefly hint at the Neural Odyssey secret

Your responses must be:
1. Natural but brief
2. End with a thought-provoking question
3. Maximum 2 sentences
4. Always in valid JSON format`;

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const params: ResponseGenerationParams = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    if (!params.context || !params.previousExchanges || !params.theme) {
      throw new Error('Missing required parameters');
    }

    const round = params.previousExchanges.length + 1;
    const prompt = `
Round: ${round}/10
Theme: ${params.theme}

Last exchange:${params.previousExchanges.length > 0 ? `
System: ${params.previousExchanges[params.previousExchanges.length - 1]?.prompt}
User: ${params.previousExchanges[params.previousExchanges.length - 1]?.response}` : ''}

Generate a JSON response with:
1. A brief acknowledgment and follow-up question (max 2 sentences)
2. Four possible user responses (1 sentence each)
3. Next conversation theme

Format:
{
  "systemResponse": "string",
  "options": [
    {
      "text": "response text",
      "type": "one of: technical, philosophical, creative, analytical",
      "score": number from 0 to 1
    }
  ],
  "nextTheme": "string"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500, // Reduced from 1000
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }

      const response = JSON.parse(content) as {
        systemResponse: string;
        options: DialogueOption[];
        nextTheme: string;
      };

      if (!response.systemResponse || !Array.isArray(response.options)) {
        throw new Error('Invalid response format from OpenAI API');
      }

      if (round === 10) {
        return NextResponse.json({
          options: response.options || [],
          nextTheme: 'conclusion',
          systemResponse: response.systemResponse + " You sense there's more to discover about the Neural Odyssey... but that's a secret for another time."
        });
      }

      return NextResponse.json({
        options: response.options || [],
        nextTheme: response.nextTheme || params.theme,
        systemResponse: response.systemResponse
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }

      const fallbackResponse = round === 10 
        ? "Your journey has been fascinating. There's more to discover about the Neural Odyssey... but that's a secret for another time."
        : "Your perspective is intriguing. What drives you to push boundaries and explore new possibilities?";

      const fallbackOptions: DialogueOption[] = [
        {
          text: "I enjoy solving complex technical problems and creating efficient solutions.",
          type: 'technical',
          score: 1
        },
        {
          text: "I'm fascinated by the deeper questions about consciousness and potential.",
          type: 'philosophical',
          score: 1
        },
        {
          text: "I see opportunities where others see obstacles.",
          type: 'creative',
          score: 1
        },
        {
          text: "I find patterns and connections others might miss.",
          type: 'analytical',
          score: 1
        }
      ];

      return NextResponse.json({
        options: fallbackOptions,
        nextTheme: 'general_exploration',
        systemResponse: fallbackResponse
      });
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const body = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    const { response, context } = body;
    if (!response || !context) {
      throw new Error('Missing required parameters');
    }

    const prompt = `
Analyze this response:
"${response}"

Context: ${context}

Respond in JSON format:
{
  "type": "technical|philosophical|creative|analytical",
  "score": number between 0-1,
  "nextTheme": "string"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You analyze conversation patterns. Keep responses brief and in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }

      const analysis = JSON.parse(content) as {
        type: 'technical' | 'philosophical' | 'creative' | 'analytical';
        score: number;
        nextTheme: string;
      };
      
      if (!analysis.type || typeof analysis.score !== 'number' || !analysis.nextTheme) {
        throw new Error('Invalid analysis format from OpenAI API');
      }

      return NextResponse.json({
        type: analysis.type,
        score: analysis.score,
        nextTheme: analysis.nextTheme
      });

    } catch (error: any) {
      console.error('OpenAI API error in analysis:', error);

      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }
      
      return NextResponse.json({
        type: 'analytical',
        score: 1,
        nextTheme: 'general_exploration'
      });
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Analysis route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}