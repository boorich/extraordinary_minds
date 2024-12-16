import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 8000, // shorter timeout to fail fast
  maxRetries: 1
});

const SYSTEM_PROMPT = `You are the Neural Odyssey system having a conversation with a potential recruit.
Keep responses very brief and focused.

Rules for your responses:
1. Questions must be 1 sentence
2. Response options must be brief statements
3. Always follow the exact JSON format provided
4. Keep all responses under 50 words each`;

type ResponseType = 'technical' | 'philosophical' | 'creative' | 'analytical';

interface DialogueOptionRaw {
  text: string;
  type: ResponseType;
  score: number;
}

interface JsonResponse {
  systemResponse: string;
  options: DialogueOptionRaw[];
  nextTheme: string;
}

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json();
    const round = params.previousExchanges.length + 1;

    const prompt = `Generate brief response in this EXACT format:
{
  "systemResponse": "One clear question?",
  "options": [
    { "text": "Brief technical response", "type": "technical", "score": 0.8 },
    { "text": "Brief philosophical response", "type": "philosophical", "score": 0.8 },
    { "text": "Brief creative response", "type": "creative", "score": 0.8 },
    { "text": "Brief analytical response", "type": "analytical", "score": 0.8 }
  ],
  "nextTheme": "theme_name"
}

Round: ${round}/10
Previous: ${params.previousExchanges[0]?.response || 'None'}

REQUIREMENTS:
1. Question must be one sentence
2. Each response must be under 15 words
3. Use only double quotes, never single quotes
4. Responses must be statements, not questions`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using 3.5-turbo for faster responses
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300, // Reduced for faster response
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      stream: false // We'll add streaming in next iteration if this still times out
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    // Parse and validate response
    let response: JsonResponse;
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      const jsonStr = content.slice(jsonStart, jsonEnd + 1)
        .replace(/'/g, '"')
        .replace(/\s+/g, ' ');
      
      response = JSON.parse(jsonStr);
      
      // Validate structure
      if (!response.systemResponse || !Array.isArray(response.options) || response.options.length !== 4) {
        throw new Error('Invalid response structure');
      }
    } catch (e) {
      console.error('JSON parse error:', e);
      // Return fallback response
      return NextResponse.json({
        systemResponse: "What motivates you to push boundaries and explore new possibilities?",
        options: [
          { text: "I thrive on solving complex technical challenges systematically.", type: "technical", score: 1 },
          { text: "I seek deeper understanding of consciousness and potential.", type: "philosophical", score: 1 },
          { text: "I find innovative solutions others might miss.", type: "creative", score: 1 },
          { text: "I analyze patterns to uncover hidden connections.", type: "analytical", score: 1 }
        ],
        nextTheme: "motivation"
      });
    }

    if (round === 10) {
      response.systemResponse += " You sense there's more to discover about the Neural Odyssey...";
      response.nextTheme = "conclusion";
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API error:', error);
    
    // Return fallback response for any error
    return NextResponse.json({
      systemResponse: "What drives your pursuit of excellence?",
      options: [
        { text: "I build efficient solutions to complex problems.", type: "technical", score: 1 },
        { text: "I explore the depths of human potential.", type: "philosophical", score: 1 },
        { text: "I see opportunities in every challenge.", type: "creative", score: 1 },
        { text: "I find patterns others might miss.", type: "analytical", score: 1 }
      ],
      nextTheme: "general_exploration"
    });
  }
}

export async function PUT(req: Request) {
  return NextResponse.json({
    type: 'analytical',
    score: 1,
    nextTheme: 'general_exploration'
  });
}