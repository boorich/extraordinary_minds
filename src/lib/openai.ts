import { DialogueOption } from '@/types/dialogue';

export interface ResponseGenerationParams {
  context: string;
  previousExchanges: Array<{
    prompt: string;
    response: string;
  }>;
  theme: string;
  constraints: string[];
}

export interface ResponseAnalysis {
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  score: number;
  nextTheme: string;
}

export interface GeneratedOptions {
  options: DialogueOption[];
  nextTheme: string;
  systemResponse: string; // Added this field to match API response
}

export async function generateResponseOptions(params: ResponseGenerationParams): Promise<GeneratedOptions> {
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
    return data;
  } catch (error) {
    console.error('Error generating response options:', error);
    throw error;
  }
}

export async function analyzeResponse(response: string, context: string): Promise<ResponseAnalysis> {
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