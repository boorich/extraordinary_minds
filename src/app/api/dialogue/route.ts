import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 8000,
  maxRetries: 1
});

const SYSTEM_PROMPT = `You are a JSON-generating AI. Always format your entire response as a SINGLE valid JSON object.
Rules:
1. Use double quotes for ALL strings and property names
2. No trailing commas
3. No comments
4. No additional text outside the JSON object
5. Keep responses brief and focused`;

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

const FALLBACK_RESPONSE = {
  systemResponse: "What drives you to push boundaries and explore new possibilities?",
  options: [
    { text: "I thrive on solving complex technical challenges systematically.", type: "technical", score: 1 },
    { text: "I seek deeper understanding of consciousness and potential.", type: "philosophical", score: 1 },
    { text: "I find innovative solutions others might miss.", type: "creative", score: 1 },
    { text: "I analyze patterns to uncover hidden connections.", type: "analytical", score: 1 }
  ],
  nextTheme: "motivation"
};

function cleanJsonString(input: string): string {
  try {
    // Find the first { and last }
    const start = input.indexOf('{');
    const end = input.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      throw new Error('No JSON object found');
    }
    
    let jsonStr = input.slice(start, end + 1);

    // Fix common JSON formatting issues
    jsonStr = jsonStr
      // Fix quotes
      .replace(/'/g, '"')
      .replace(/`/g, '"')
      // Remove newlines and extra spaces
      .replace(/\s+/g, ' ')
      // Fix property names without quotes
      .replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":')
      // Fix trailing commas
      .replace(/,\s*([}\]])/g, '$1')
      // Ensure numbers are properly formatted
      .replace(/(\d),(\d)/g, '$1.$2')
      // Fix possible missing quotes in values
      .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*(,|})/g, ':"$1"$2');

    // Verify it's valid JSON by parsing it
    JSON.parse(jsonStr);
    
    return jsonStr;
  } catch (e) {
    console.error('JSON cleaning failed:', e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json();
    const round = params.previousExchanges.length + 1;

    const prompt = `Return ONLY a JSON object exactly like this:
{
  "systemResponse": "One direct question about their abilities or mindset?",
  "options": [
    {"text": "Technical perspective answer", "type": "technical", "score": 0.8},
    {"text": "Philosophical perspective answer", "type": "philosophical", "score": 0.8},
    {"text": "Creative perspective answer", "type": "creative", "score": 0.8},
    {"text": "Analytical perspective answer", "type": "analytical", "score": 0.8}
  ],
  "nextTheme": "theme_name"
}

Current round: ${round}/10
Last response: ${params.previousExchanges[0]?.response || 'None'}

Remember:
1. Use DOUBLE QUOTES for ALL strings
2. Keep the question under 15 words
3. Keep each answer under 15 words
4. Answers must be statements, not questions`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.6
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    // Clean and parse JSON
    let response: JsonResponse;
    try {
      const cleanedJson = cleanJsonString(content);
      response = JSON.parse(cleanedJson);

      // Additional validation
      if (!response.systemResponse || !Array.isArray(response.options) || response.options.length !== 4) {
        throw new Error('Invalid response structure');
      }

      // Ensure all options have required fields
      if (!response.options.every(opt => 
        opt.text && 
        opt.type && 
        ['technical', 'philosophical', 'creative', 'analytical'].includes(opt.type) &&
        typeof opt.score === 'number'
      )) {
        throw new Error('Invalid option structure');
      }

    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(FALLBACK_RESPONSE);
    }

    if (round === 10) {
      response.systemResponse += " You sense there's more to discover about the Neural Odyssey...";
      response.nextTheme = "conclusion";
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(FALLBACK_RESPONSE);
  }
}

export async function PUT(req: Request) {
  return NextResponse.json({
    type: 'analytical',
    score: 1,
    nextTheme: 'general_exploration'
  });
}