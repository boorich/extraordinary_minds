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
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 1000; // 1 second minimum between requests
  private pendingRequest: Promise<any> | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCompletion(params: CompletionParams) {
    const now = Date.now();
    const timeToWait = Math.max(0, this.lastRequestTime + this.minRequestInterval - now);
    
    if (timeToWait > 0) {
      console.log(`Throttling request for ${timeToWait}ms`);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    if (this.pendingRequest) {
      console.log('Request already in progress, waiting for completion');
      return this.pendingRequest;
    }

    this.lastRequestTime = Date.now();
    
    try {
      this.pendingRequest = fetch('/api/agent/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }).then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          throw new Error(errorData.details || 'Failed to generate completion');
        }
        return response.json();
      });

      return await this.pendingRequest;
    } finally {
      this.pendingRequest = null;
    }
  }
}