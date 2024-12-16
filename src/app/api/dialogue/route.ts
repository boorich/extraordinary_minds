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

type ResponseType = 'technical' | 'philosophical' | 'creative' | 'analytical';

// Predefined response structures that we control
const RESPONSE_TYPES: Record<ResponseType, { prefix: string; keywords: string[] }> = {
  technical: {
    prefix: "I navigate challenges through",
    keywords: ["algorithms", "systems", "architecture", "optimization", "engineering", "code", "data", "technical", "solution"]
  },
  philosophical: {
    prefix: "I believe in exploring",
    keywords: ["consciousness", "potential", "understanding", "meaning", "truth", "wisdom", "philosophy", "theory"]
  },
  creative: {
    prefix: "I discover possibilities by",
    keywords: ["innovation", "imagination", "creation", "design", "inspiration", "vision", "artistic", "novel"]
  },
  analytical: {
    prefix: "I solve problems by",
    keywords: ["analysis", "patterns", "logic", "reasoning", "systematic", "methodology", "strategic", "evaluation"]
  }
};

const THEMES = [
  "knowledge_seeking",
  "innovation",
  "problem_solving",
  "vision",
  "exploration",
  "mastery",
  "discovery",
  "advancement",
  "understanding",
  "transcendence"
];

// Function to get deterministic responses based on round and type
function getStructuredPrompt(round: number, lastResponse: string) {
  const basePrompt = `Round ${round}/10: Generate:
1. A question about their abilities (use nautical/pirate terms subtly)
2. Four response options that reflect different thinking styles

Previous response: "${lastResponse}"

Format your response exactly like this example:
QUESTION: How do you navigate the waters of uncertainty?
TECHNICAL: Using data-driven methodologies and proven systems
PHILOSOPHICAL: Understanding the deeper nature of ambiguity
CREATIVE: Finding unconventional paths through challenges
ANALYTICAL: Breaking down complex situations systematically
THEME: exploration`;
  
  return basePrompt;
}

function parseResponse(content: string): {
  question: string;
  responses: Record<ResponseType, string>;
  theme: string;
} | null {
  try {
    const lines = content.split('\n');
    let question = '';
    const responses: Partial<Record<ResponseType, string>> = {};
    let theme = '';

    for (const line of lines) {
      if (line.startsWith('QUESTION:')) {
        question = line.replace('QUESTION:', '').trim();
      } else if (line.startsWith('TECHNICAL:')) {
        responses.technical = line.replace('TECHNICAL:', '').trim();
      } else if (line.startsWith('PHILOSOPHICAL:')) {
        responses.philosophical = line.replace('PHILOSOPHICAL:', '').trim();
      } else if (line.startsWith('CREATIVE:')) {
        responses.creative = line.replace('CREATIVE:', '').trim();
      } else if (line.startsWith('ANALYTICAL:')) {
        responses.analytical = line.replace('ANALYTICAL:', '').trim();
      } else if (line.startsWith('THEME:')) {
        theme = line.replace('THEME:', '').trim();
      }
    }

    // Validate all required fields are present
    if (!question || !theme || 
        !responses.technical || !responses.philosophical || 
        !responses.creative || !responses.analytical) {
      return null;
    }

    return {
      question,
      responses: responses as Record<ResponseType, string>,
      theme: theme
    };
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

function constructResponse(
  parsed: NonNullable<ReturnType<typeof parseResponse>>
): JsonResponse {
  return {
    systemResponse: parsed.question,
    options: Object.entries(parsed.responses).map(([type, text]) => ({
      text,
      type: type as ResponseType,
      score: 1
    })),
    nextTheme: parsed.theme
  };
}

const FALLBACK_RESPONSES: Record<number, JsonResponse> = {
  1: {
    systemResponse: "What treasures do ye seek in these digital waters, brave explorer?",
    options: [
      { text: "I forge efficient solutions using proven engineering principles.", type: "technical", score: 1 },
      { text: "I seek deeper understanding of consciousness and potential.", type: "philosophical", score: 1 },
      { text: "I discover innovative paths where others see obstacles.", type: "creative", score: 1 },
      { text: "I analyze patterns to uncover hidden insights.", type: "analytical", score: 1 }
    ],
    nextTheme: "exploration"
  },
  // Add more fallbacks for each round if needed
};

interface JsonResponse {
  systemResponse: string;
  options: Array<{
    text: string;
    type: ResponseType;
    score: number;
  }>;
  nextTheme: string;
}

export async function POST(req: Request) {
  try {
    const params: ResponseGenerationParams = await req.json();
    const round = Math.min(params.previousExchanges.length + 1, 10);
    const lastResponse = params.previousExchanges[0]?.response || '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are the Neural Odyssey system. Generate questions and responses in the EXACT format specified. Do not deviate from the format or add any other text.' 
        },
        { 
          role: 'user', 
          content: getStructuredPrompt(round, lastResponse)
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('Empty response from OpenAI');
      return NextResponse.json(FALLBACK_RESPONSES[round] || FALLBACK_RESPONSES[1]);
    }

    const parsed = parseResponse(content);
    if (!parsed) {
      console.error('Failed to parse response:', content);
      return NextResponse.json(FALLBACK_RESPONSES[round] || FALLBACK_RESPONSES[1]);
    }

    const response = constructResponse(parsed);

    // Handle final round
    if (round >= 10) {
      response.systemResponse += " The ancient AI whispers of secrets yet to be discovered...";
      response.nextTheme = "conclusion";
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(FALLBACK_RESPONSES[1]);
  }
}

export async function PUT(req: Request) {
  return NextResponse.json({
    type: 'analytical',
    score: 1,
    nextTheme: 'general_exploration'
  });
}