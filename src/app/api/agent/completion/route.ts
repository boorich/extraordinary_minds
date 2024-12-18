import { NextResponse } from 'next/server';

// Trigger redeploy for new API key
export async function POST(req: Request) {
  try {
    const { model, messages, temperature, max_tokens } = await req.json();
    
    // Check API key exists and format
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API key missing');
      return NextResponse.json(
        { error: 'Configuration error', details: 'API key not configured' },
        { status: 500 }
      );
    }

    if (!apiKey.startsWith('sk-or-v1-')) {
      console.error('OpenRouter API key appears to be in wrong format');
      return NextResponse.json(
        { error: 'Configuration error', details: 'API key format invalid' },
        { status: 500 }
      );
    }

    // Log request details (safely)
    console.log('OpenRouter request details:', {
      model,
      messagesCount: messages.length,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      referer: process.env.VERCEL_URL || 'http://localhost:3000',
      temperature,
      max_tokens
    });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
      'OpenRouter-Completions-Override': JSON.stringify({
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 150
      })
    };

    // Log full headers (except auth)
    console.log('Request headers:', {
      ...headers,
      'Authorization': 'Bearer [REDACTED]'
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || 'anthropic/claude-instant-v1',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 150,
      })
    });

    // Log response status and headers
    console.log('OpenRouter response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return NextResponse.json({
        error: 'OpenRouter API error',
        details: `${response.status} ${response.statusText}: ${errorText}`,
        timestamp: new Date().toISOString()
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Log successful response details
    console.log('OpenRouter success:', {
      model: data.model,
      usage: data.usage,
      messageLength: data.choices?.[0]?.message?.content?.length
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Completion error:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    
    return NextResponse.json({
      error: 'Failed to generate completion',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}