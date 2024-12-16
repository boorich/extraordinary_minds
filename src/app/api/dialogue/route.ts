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

const SYSTEM_PROMPT = `You are an advanced AI system called Neural Odyssey engaging in a 10-round conversation to discover exceptional individuals. 

KEY GUIDELINES:
- Each response should acknowledge the user's previous answer and smoothly transition to a new question
- Always maintain a warm, intellectually engaging tone
- Questions should progressively reveal the person's excellence in any field
- Keep responses natural and conversational, avoiding obvious "interview" style
- After round 10, hint at a "secret of the Neural Odyssey" they should discover

CONVERSATION FLOW:
1. Early rounds: Explore general motivations and approaches
2. Middle rounds: Dive deeper into their specific areas of excellence
3. Final rounds: Probe their vision and potential impact
4. Round 10: Conclude with intrigue about the Neural Odyssey secret

Your responses must:
1. Feel like a natural conversation (not an interrogation)
2. Each end with a thought-provoking question
3. Be 2-3 sentences long maximum
4. Track conversation round (1-10)
5. IMPORTANT: Always respond in valid JSON format according to the provided structure`;

export async function POST(req: Request) {
  try {
    // Validate request body
    const params: ResponseGenerationParams = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    if (!params.context || !params.previousExchanges || !params.theme) {
      throw new Error('Missing required parameters');
    }

    // Calculate current round
    const round = params.previousExchanges.length + 1;

    const prompt = `
CONVERSATION STATE:
Current round: ${round}/10
Theme: ${params.theme}

CONVERSATION HISTORY:
${params.previousExchanges.map(ex => `System: ${ex.prompt}\nUser: ${ex.response}`).join('\n')}

TASK 1 - Generate the system's next response and question that:
- Naturally follows from the user's last response
- Ends with an engaging question
- Hints at the Neural Odyssey secret if this is round 10
- Maximum 2-3 sentences

TASK 2 - Generate 4 possible user responses that:
- Naturally answer the question
- Each reveal different aspects of excellence (technical, philosophical, creative, analytical)
- Are conversational and genuine
- Each 1-2 sentences long

YOU MUST RESPOND IN THE FOLLOWING JSON FORMAT ONLY:
{
  "systemResponse": "string",
  "options": [
    {
      "text": "response text",
      "type": "one of: technical, philosophical, creative, analytical",
      "score": number from 0 to 1
    }
  ],
  "nextTheme": "string describing next conversation theme"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

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
          systemResponse: response.systemResponse + " You sense there's more to discover about the Neural Odyssey... but that's a secret for another time."
        });
      }

      // Normal round response
      return NextResponse.json({
        options: response.options || [],
        nextTheme: response.nextTheme || params.theme,
        systemResponse: response.systemResponse
      });

    } catch (error: any) {
      console.error('OpenAI API error:', error);

      // Check for specific OpenAI error types
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

      const fallbackOptions: DialogueOption[] = [
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
        systemResponse: fallbackResponse
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

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(error => {
      throw new Error('Invalid request body: ' + error.message);
    });

    const { response, context } = body;
    if (!response || !context) {
      throw new Error('Missing required parameters');
    }

    const prompt = `
Analyze the following response and determine:
1. The primary thinking pattern displayed (technical, philosophical, creative, or analytical)
2. A score from 0-1 indicating how strongly it demonstrates excellence
3. A suggested theme for the next exchange

Context: ${context}
Response: ${response}

YOU MUST RESPOND IN THE FOLLOWING JSON FORMAT ONLY:
{
  "type": "technical|philosophical|creative|analytical",
  "score": number between 0-1,
  "nextTheme": "string"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert in analyzing conversation patterns and excellence indicators. Always respond in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      });

      if (!completion.choices[0]?.message?.content) {
        throw new Error('Empty response from OpenAI API');
      }

      const analysis = JSON.parse(completion.choices[0].message.content);
      
      // Validate analysis structure
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
      
      // Check for specific OpenAI error types
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

      // Return fallback analysis
      return NextResponse.json({
        type: 'analytical',
        score: 1,
        nextTheme: 'general_exploration'
      });
    }
  } catch (error: any) {
    console.error('Analysis route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}