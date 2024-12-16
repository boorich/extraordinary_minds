import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Timeout utility
const timeoutPromise = (ms: number) => new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Request timeout')), ms);
});

// Constants
const TIMEOUT_MS = 9000; // 9 seconds to stay under Vercel's 10s limit
const SYSTEM_PROMPT = `You are an advanced AI system called Neural Odyssey engaging in conversations to discover exceptional individuals.

Your task is to generate engaging responses and analyze user inputs efficiently. Always format responses as valid JSON.

KEY GUIDELINES:
- Keep responses concise (2-3 sentences)
- End with thought-provoking questions
- Analyze thinking patterns (technical, philosophical, creative, analytical)
- Track conversation round (1-10)
- Maintain engaging, natural conversation flow`;

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    if (!params.context || !params.previousExchanges || !params.theme) {
      throw new Error('Missing required parameters');
    }

    const round = params.previousExchanges.length + 1;
    const lastResponse = params.previousExchanges[params.previousExchanges.length - 1]?.response || '';

    const prompt = `
CURRENT STATE:
Round: ${round}/10
Theme: ${params.theme}
Last Response: ${lastResponse}

TASK: Generate a combined response that includes:
1. System's next response and question (2-3 sentences)
2. Analysis of user's last response (if any)
3. Four possible next responses for the user

RESPOND IN THIS EXACT JSON FORMAT:
{
  "systemResponse": "your engaging response with question",
  "analysis": {
    "type": "technical|philosophical|creative|analytical",
    "score": 0.1 to 1.0,
    "theme": "next conversation theme"
  },
  "options": [
    {
      "text": "possible user response",
      "type": "technical|philosophical|creative|analytical",
      "score": 0.1 to 1.0
    }
  ]
}`;

    try {
      // Race between API call and timeout
      const completion = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-3.5-turbo',  // Using 3.5-turbo for faster response
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        }),
        timeoutPromise(TIMEOUT_MS)
      ]);

      if (!completion.choices[0]?.message?.content) {
        throw new Error('Empty response from OpenAI API');
      }

      const response = JSON.parse(completion.choices[0].message.content);

      // Validate response structure
      if (!response.systemResponse || !Array.isArray(response.options)) {
        throw new Error('Invalid response format from OpenAI API');
      }

      // Handle round 10 conclusion
      if (round === 10) {
        return NextResponse.json({
          options: response.options || [],
          nextTheme: 'conclusion',
          systemResponse: response.systemResponse + " You sense there's more to discover about the Neural Odyssey... but that's a secret for another time.",
          analysis: response.analysis
        });
      }

      // Normal round response
      return NextResponse.json({
        options: response.options || [],
        nextTheme: response.analysis?.theme || params.theme,
        systemResponse: response.systemResponse,
        analysis: response.analysis
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);

      // Specific error handling
      if (error.message === 'Request timeout') {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      }

      if (error.code === 'insufficient_quota') {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid API key configuration.' },
          { status: 401 }
        );
      }

      // Return fallback response
      const fallbackResponse = round === 10 
        ? "Your journey has been fascinating. There's more to discover about the Neural Odyssey... but that's a secret for another time."
        : "Your perspective is intriguing. What drives you to push boundaries and explore new possibilities?";

      const fallbackOptions = [
        {
          text: "I'm driven by the challenge of solving complex problems and creating efficient solutions.",
          type: 'technical',
          score: 1
        },
        {
          text: "The endless possibilities of human potential and consciousness fascinate me.",
          type: 'philosophical',
          score: 1
        },
        {
          text: "I see opportunities where others see obstacles, always finding new ways forward.",
          type: 'creative',
          score: 1
        },
        {
          text: "I'm motivated by understanding patterns and uncovering hidden connections.",
          type: 'analytical',
          score: 1
        }
      ];

      return NextResponse.json({
        options: fallbackOptions,
        nextTheme: 'general_exploration',
        systemResponse: fallbackResponse,
        analysis: {
          type: 'analytical',
          score: 1,
          theme: 'general_exploration'
        }
      });
    }
  } catch (error: any) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

// PUT endpoint removed since analysis is now combined in POST