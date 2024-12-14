import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // We'll want to move this to an API route later
});

export interface ResponseGenerationParams {
  context: string;
  previousExchanges: Array<{
    prompt: string;
    response: string;
  }>;
  theme: string;
  constraints: string[];
}

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

export async function generateResponseOptions(params: ResponseGenerationParams): Promise<string[]> {
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
2. Each reveal different thinking patterns
3. Lead to meaningfully different conversation paths
4. Maintain our space/cosmic theme
5. Are each 1-2 sentences long

Format the response as a JSON array of strings.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response.options || [];
  } catch (error) {
    console.error('Error generating response options:', error);
    throw error;
  }
}

export async function analyzeResponse(response: string, context: string): Promise<{
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  score: number;
  nextTheme?: string;
}> {
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

  try {
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

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error analyzing response:', error);
    throw error;
  }
}