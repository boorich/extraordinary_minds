import { NextResponse } from 'next/server';
import { OpenRouterApi } from '@/lib/openrouter';

export async function POST(req: Request) {
  try {
    const { model, messages, temperature, max_tokens } = await req.json();
    
    const openRouter = new OpenRouterApi(process.env.OPENROUTER_API_KEY!);
    
    const completion = await openRouter.createCompletion({
      model,
      messages,
      temperature,
      max_tokens
    });

    return NextResponse.json(completion);
  } catch (error) {
    console.error('Error in agent completion:', error);
    return NextResponse.json(
      { error: 'Failed to generate completion' },
      { status: 500 }
    );
  }
}