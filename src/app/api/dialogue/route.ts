import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

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
4. Track conversation round (1-10)`;

export async function POST(req: Request) {
  const params: ResponseGenerationParams = await req.json();
  
  try {
    const { context, previousExchanges, theme } = params;

    // Calculate current round
    const round = previousExchanges.length + 1;

    const prompt = `
CONVERSATION STATE:
Current round: ${round}/10
Theme: ${theme}

CONVERSATION HISTORY:
${previousExchanges.map(ex => `System: ${ex.prompt}\nUser: ${ex.response}`).join('\n')}

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

Format as JSON:
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

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
      nextTheme: response.nextTheme || theme,
      systemResponse: response.systemResponse
    });

  } catch (error) {
    console.error('Error in dialogue API:', error);
    
    // Fallback response that maintains conversation flow
    const round = params.previousExchanges?.length + 1 || 1;
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
}

export async function PUT(req: Request) {
  try {
    const { response, context } = await req.json();

    const prompt = `
Analyze the following response and determine:
1. The primary thinking pattern displayed (technical, philosophical, creative, or analytical)
2. A score from 0-1 indicating how strongly it demonstrates excellence
3. A suggested theme for the next exchange

Context: ${context}
Response: ${response}

Format as JSON:
{
  "type": "technical|philosophical|creative|analytical",
  "score": number between 0-1,
  "nextTheme": "string"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert in analyzing conversation patterns and excellence indicators.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json({
      type: analysis.type || 'analytical',
      score: typeof analysis.score === 'number' ? analysis.score : 1,
      nextTheme: analysis.nextTheme || 'general_exploration'
    });
  } catch (error) {
    console.error('Error in analysis API:', error);
    return NextResponse.json({
      type: 'analytical',
      score: 1,
      nextTheme: 'general_exploration'
    });
  }
}