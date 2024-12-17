interface CompletionParams {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export class OpenRouterApi {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCompletion(params: CompletionParams) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
        'OpenRouter-Completions-Override': JSON.stringify({
          temperature: params.temperature || 0.7,
          max_tokens: params.max_tokens || 150
        })
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API call failed: ${response.statusText}`);
    }

    return response.json();
  }
}