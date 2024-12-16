import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ResponseGenerationParams } from '@/lib/openai';
import { DialogueOption } from '@/types/dialogue';

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Not exposed to client
});

const SYSTEM_PROMPT = `You are an advanced ship's AI consciousness engaging in dialogue with a potential crew member. 
Your responses should be:
1. Thought-provoking and deep, but not obtuse
2. Contextually aware of the space/cosmic theme
3. Designed to reveal the respondent's thinking patterns
4. Each option should probe different aspects (technical, philosophical, creative, analytical)

Maintain a tone that is:
- Intelligent but not pretentious
- Curious but not interrogative
- Technical but not dry
- Mysterious but not cryptic`;

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json();
    const { context, previousExchanges, theme, constraints } = params;

    const prompt = `
Given the following context and conversation history, generate 4 distinct response options that will reveal different aspects of the respondent's thinking patterns.

Current theme: ${theme}

Previous exchanges:
${previousExchanges.map(ex => `System: ${ex.prompt}\nUser: ${ex.response}`).join('\n')}

Current context: ${context}

Constraints:
${constraints.join('\n')}

Generate 4 response options that:
1. Are contextually relevant
2. Each reveal different thinking patterns (one technical, one philosophical, one creative, and one analytical)
3. Lead to meaningfully different conversation paths
4. Maintain our space/cosmic theme
5. Are each 1-2 sentences long

Format each response as a JSON object with properties:
- text: the response text
- type: one of ["technical", "philosophical", "creative", "analytical"]
- score: number between 0 and 1

Return an array of these objects.`;

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

    // Parse and validate the response
    const parsedResponse = JSON.parse(completion.choices[0].message.content || '{}');
    const options = parsedResponse.options || [];
    
    // Ensure each option has the required properties
    const validatedOptions: DialogueOption[] = options.map((option: any) => ({
      text: option.text || 'Please try another response.',
      type: option.type || 'analytical',
      score: typeof option.score === 'number' ? option.score : 1
    }));

    // Always return at least one option
    if (validatedOptions.length === 0) {
      validatedOptions.push({
        text: 'Let us explore that idea further.',
        type: 'analytical',
        score: 1
      });
    }

    return NextResponse.json({
      options: validatedOptions,
      nextTheme: parsedResponse.nextTheme || theme
    });
  } catch (error) {
    console.error('Error in dialogue API:', error);
    
    // Return fallback options in case of error
    const fallbackOptions: DialogueOption[] = [
      {
        text: "I'm intrigued by your analytical approach. Tell me more about how you solve complex problems.",
        type: 'analytical',
        score: 1
      },
      {
        text: "Your perspective raises interesting philosophical questions about consciousness and reality.",
        type: 'philosophical',
        score: 1
      },
      {
        text: "I see you have a technical mindset. How do you approach building new solutions?",
        type: 'technical',
        score: 1
      },
      {
        text: "Your creative thinking is refreshing. How do you imagine the future of autonomous systems?",
        type: 'creative',
        score: 1
      }
    ];

    return NextResponse.json({
      options: fallbackOptions,
      nextTheme: 'general_exploration'
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { response, context } = await req.json();

    const prompt = `
Analyze the following response in the given context and determine:
1. The primary thinking pattern displayed (technical, philosophical, creative, or analytical)
2. A score from 0-1 indicating the strength of this pattern
3. A suggested theme for the next exchange

Context: ${context}
Response: ${response}

Respond in JSON format with properties:
- type: one of ["technical", "philosophical", "creative", "analytical"]
- score: number between 0 and 1
- nextTheme: string suggesting the next conversation theme`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert in analyzing conversation patterns and thinking styles.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Validate the analysis
    const validatedAnalysis = {
      type: analysis.type || 'analytical',
      score: typeof analysis.score === 'number' ? analysis.score : 1,
      nextTheme: analysis.nextTheme || 'general_exploration'
    };

    return NextResponse.json(validatedAnalysis);
  } catch (error) {
    console.error('Error in analysis API:', error);
    return NextResponse.json({
      type: 'analytical',
      score: 1,
      nextTheme: 'general_exploration'
    });
  }
}