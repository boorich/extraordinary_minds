export interface ResponseGenerationParams {
  context: string;
  previousExchanges: Array<{
    prompt: string;
    response: string;
  }>;
  theme: string;
  constraints: string[];
}

export async function generateResponseOptions(params: ResponseGenerationParams): Promise<string[]> {
  try {
    const response = await fetch('/api/dialogue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to generate responses');
    }

    const data = await response.json();
    return data.options;
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
  try {
    const apiResponse = await fetch('/api/dialogue', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response, context }),
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to analyze response');
    }

    return apiResponse.json();
  } catch (error) {
    console.error('Error analyzing response:', error);
    throw error;
  }
}