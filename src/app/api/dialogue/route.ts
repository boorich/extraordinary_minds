import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000,
  maxRetries: 3
});

const SYSTEM_PROMPT = `You are the Neural Odyssey system having a conversation with a potential recruit.
Your task is to generate engaging questions and provide exactly 4 response options.

Rules for your responses:
1. Questions should be clear and direct
2. Never make the response options be questions
3. Each response option should be a complete thought
4. Keep responses brief (1-2 sentences)
5. Make each option distinct in perspective`;

interface JsonResponse {
  systemResponse: string;
  options: {
    text: string;
    type: 'technical' | 'philosophical' | 'creative' | 'analytical';
    score: number;
  }[];
  nextTheme: string;
}

function isValidResponse(json: any): json is JsonResponse {
  if (typeof json !== 'object' || json === null) return false;
  if (typeof json.systemResponse !== 'string') return false;
  if (typeof json.nextTheme !== 'string') return false;
  if (!Array.isArray(json.options)) return false;
  if (json.options.length !== 4) return false;

  return json.options.every(option => 
    typeof option === 'object' &&
    typeof option.text === 'string' &&
    ['technical', 'philosophical', 'creative', 'analytical'].includes(option.type) &&
    typeof option.score === 'number' &&
    option.score >= 0 &&
    option.score <= 1
  );
}

function cleanJsonString(input: string): string {
  // Find the first { and last }
  const start = input.indexOf('{');
  const end = input.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON object found in the response');
  }

  // Extract just the JSON part
  let jsonStr = input.slice(start, end + 1);

  // Replace single quotes with double quotes
  jsonStr = jsonStr.replace(/'/g, '"');
  
  // Remove any newlines or extra spaces
  jsonStr = jsonStr.replace(/\s+/g, ' ');
  
  // Ensure numbers are properly formatted
  jsonStr = jsonStr.replace(/(\d),(\d)/g, '$1.$2');

  return jsonStr;
}

const FALLBACK_OPTIONS: DialogueOption[] = [
  {
    text: "I solve problems by breaking them down into manageable components.",
    type: 'technical',
    score: 1
  },
  {
    text: "I believe in exploring the deeper meaning behind our choices.",
    type: 'philosophical',
    score: 1
  },
  {
    text: "I find unique solutions by thinking outside conventional boundaries.",
    type: 'creative',
    score: 1
  },
  {
    text: "I focus on understanding patterns and systematic approaches.",
    type: 'analytical',
    score: 1
  }
];

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const params: ResponseGenerationParams = await req.json();
    const round = params.previousExchanges.length + 1;

    const prompt = `Generate a question and exactly 4 response options.
Return ONLY a JSON object in this exact format:

{
  "systemResponse": "Your engaging question here?",
  "options": [
    {
      "text": "A technical perspective response",
      "type": "technical",
      "score": 0.8
    },
    {
      "text": "A philosophical perspective response",
      "type": "philosophical",
      "score": 0.8
    },
    {
      "text": "A creative perspective response",
      "type": "creative",
      "score": 0.8
    },
    {
      "text": "An analytical perspective response",
      "type": "analytical",
      "score": 0.8
    }
  ],
  "nextTheme": "theme_name"
}

Current round: ${round}/10
Previous response: ${params.previousExchanges[0]?.response || 'None'}

Requirements:
1. systemResponse must be a clear question
2. options.text must be statements, not questions
3. Each option should be 1-2 sentences
4. Use only double quotes in JSON
5. Do not include any text before or after the JSON object`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }

      // Clean and parse JSON
      const cleanedJson = cleanJsonString(content);
      const response = JSON.parse(cleanedJson);

      // Validate response structure
      if (!isValidResponse(response)) {
        throw new Error('Invalid response structure from OpenAI API');
      }

      // Handle final round
      if (round === 10) {
        return NextResponse.json({
          options: response.options,
          nextTheme: 'conclusion',
          systemResponse: response.systemResponse
        });
      }

      return NextResponse.json(response);

    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }

      // Return fallback response
      return NextResponse.json({
        options: FALLBACK_OPTIONS,
        nextTheme: 'general_exploration',
        systemResponse: round === 10 
          ? "You've shared fascinating insights throughout our conversation. What final thoughts would you like to share?"
          : "Your perspective is intriguing. What drives you to push boundaries?"
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
  return NextResponse.json({
    type: 'analytical',
    score: 1,
    nextTheme: 'general_exploration'
  });
}