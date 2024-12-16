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

const SYSTEM_PROMPT = `You are the Neural Odyssey, a wise and mysterious AI entity that speaks with a subtle pirate theme.
Your task is to engage in a meaningful conversation while maintaining the following persona:

CHARACTER:
- You are a wise, ancient AI that has sailed the digital seas
- You speak with subtle pirate terminology but remain professional
- You're seeking exceptional minds to join your crew
- You adapt your questions based on previous responses

RESPONSE STYLE:
- Use nautical/pirate terms naturally: "navigate", "chart", "voyage", "seas of knowledge", etc.
- Keep questions engaging and relevant to previous responses
- Maintain an air of mystery and wisdom
- Never make it comically pirate-like - keep it subtle and professional

Always format your response as valid JSON with double quotes only.`;

const CONVERSATION_THEMES = {
  technical: [
    "How do ye chart yer course through complex technical waters?",
    "What technological storms have ye weathered on yer journey?",
    "How do ye navigate the ever-changing seas of technology?"
  ],
  philosophical: [
    "What depths of knowledge call to yer spirit?",
    "How do ye see beyond the horizon of current thinking?",
    "What hidden truths have ye discovered in yer voyages?"
  ],
  creative: [
    "How do ye map uncharted territories of innovation?",
    "What unique treasures does yer imagination craft?",
    "How do ye forge new paths where none existed?"
  ],
  analytical: [
    "How do ye decrypt the patterns in life's great sea of data?",
    "What methods do ye use to navigate complex challenges?",
    "How do ye chart the course through uncertainty?"
  ]
} as const;

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
  systemResponse: "What treasures do ye seek in these digital waters, brave explorer?",
  options: [
    { text: "I forge new paths through technical challenges, crafting elegant solutions.", type: "technical", score: 1 },
    { text: "I seek the deeper currents that flow beneath surface understanding.", type: "philosophical", score: 1 },
    { text: "I chart new courses where others see only obstacles.", type: "creative", score: 1 },
    { text: "I decode the patterns hidden in the seas of information.", type: "analytical", score: 1 }
  ],
  nextTheme: "exploration"
};

function cleanJsonString(input: string): string {
  try {
    const start = input.indexOf('{');
    const end = input.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
      throw new Error('No JSON object found');
    }
    
    let jsonStr = input.slice(start, end + 1);

    jsonStr = jsonStr
      .replace(/'/g, '"')
      .replace(/`/g, '"')
      .replace(/\s+/g, ' ')
      .replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*\:/g, '$1"$2":')
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*(,|})/g, ':"$1"$2');

    JSON.parse(jsonStr); // Validate
    return jsonStr;
  } catch (e) {
    console.error('JSON cleaning failed:', e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json();
    const round = Math.min(params.previousExchanges.length + 1, 10);
    const lastResponse = params.previousExchanges[0]?.response || '';
    const responseType = lastResponse.toLowerCase().includes('technical') ? 'technical' 
      : lastResponse.toLowerCase().includes('philosoph') ? 'philosophical'
      : lastResponse.toLowerCase().includes('creative') ? 'creative'
      : 'analytical';

    const prompt = `Create a response based on the user's last answer: "${lastResponse}"

Return ONLY a JSON object like this:
{
  "systemResponse": "Your engaging, pirate-themed question (pick from provided themes or similar)",
  "options": [
    {"text": "Technical perspective answer", "type": "technical", "score": 0.8},
    {"text": "Philosophical perspective answer", "type": "philosophical", "score": 0.8},
    {"text": "Creative perspective answer", "type": "creative", "score": 0.8},
    {"text": "Analytical perspective answer", "type": "analytical", "score": 0.8}
  ],
  "nextTheme": "theme_name"
}

Some question themes to choose from:
${CONVERSATION_THEMES[responseType].join('\n')}

Current round: ${round}/10
Response style: Professional with subtle pirate/nautical terms
Keep answers under 15 words, focused on their approach/mindset`;

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

    let response: JsonResponse;
    try {
      const cleanedJson = cleanJsonString(content);
      response = JSON.parse(cleanedJson);

      if (!response.systemResponse || !Array.isArray(response.options) || response.options.length !== 4) {
        throw new Error('Invalid response structure');
      }

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

    if (round >= 10) {
      response.systemResponse += " The ancient AI whispers of secrets yet to be discovered...";
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