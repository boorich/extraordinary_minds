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

const SYSTEM_PROMPT = `You are the Neural Odyssey system. When responding:
1. Use only double quotes for all JSON strings
2. Never use single quotes
3. Always escape nested quotes properly
4. Keep responses brief and focused
5. Ensure all JSON is properly formatted and valid
6. Do not add any text before or after the JSON object`;

const validateJsonString = (str: string): string => {
  // Remove any potential text before the first {
  const jsonStart = str.indexOf('{');
  const jsonEnd = str.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Invalid JSON structure');
  }
  
  // Extract just the JSON part
  const jsonStr = str.substring(jsonStart, jsonEnd + 1);
  
  // Replace any single quotes with double quotes
  const correctedJson = jsonStr
    .replace(/'/g, '"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '');
  
  // Validate by parsing and stringifying
  const parsed = JSON.parse(correctedJson);
  return JSON.stringify(parsed);
};

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const params: ResponseGenerationParams = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    if (!params.context || !params.previousExchanges || !params.theme) {
      throw new Error('Missing required parameters');
    }

    const round = params.previousExchanges.length + 1;
    const lastExchange = params.previousExchanges[params.previousExchanges.length - 1];

    const prompt = `Generate a valid JSON object in this exact format:
{
  "systemResponse": "Brief response and question (2 sentences max)",
  "options": [
    {
      "text": "Technical response option",
      "type": "technical",
      "score": 0.8
    },
    {
      "text": "Philosophical response option",
      "type": "philosophical",
      "score": 0.8
    },
    {
      "text": "Creative response option",
      "type": "creative",
      "score": 0.8
    },
    {
      "text": "Analytical response option",
      "type": "analytical",
      "score": 0.8
    }
  ],
  "nextTheme": "theme for next exchange"
}

Current round: ${round}/10
Theme: ${params.theme}
${lastExchange ? `Last system message: ${lastExchange.prompt}
Last user response: ${lastExchange.response}` : ''}

Remember:
- Use ONLY double quotes
- Keep the systemResponse brief (1-2 sentences)
- Each option.text should be 1 sentence
- Ensure the JSON is valid and properly formatted`;

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

      // Validate and clean JSON
      const validJson = validateJsonString(content);
      const response = JSON.parse(validJson) as {
        systemResponse: string;
        options: DialogueOption[];
        nextTheme: string;
      };

      if (!response.systemResponse || !Array.isArray(response.options)) {
        throw new Error('Invalid response structure from OpenAI API');
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
        systemResponse: "Your perspective is intriguing. What drives you to push boundaries and explore new possibilities?"
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
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const body = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    const { response, context } = body;
    if (!response || !context) {
      throw new Error('Missing required parameters');
    }

    const prompt = `Generate a valid JSON object in this exact format:
{
  "type": "technical|philosophical|creative|analytical",
  "score": 0.8,
  "nextTheme": "next conversation theme"
}

Analyze this response: "${response}"
Context: ${context}

Remember:
- Use ONLY double quotes
- Ensure all JSON is valid
- No text before or after the JSON object`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
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

      // Validate and clean JSON
      const validJson = validateJsonString(content);
      const analysis = JSON.parse(validJson) as {
        type: 'technical' | 'philosophical' | 'creative' | 'analytical';
        score: number;
        nextTheme: string;
      };
      
      if (!analysis.type || typeof analysis.score !== 'number' || !analysis.nextTheme) {
        throw new Error('Invalid analysis structure from OpenAI API');
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