import { DialogueOption, DialogueHistoryEntry } from '@/types/dialogue';

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
  systemResponse: string;
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
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
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.options || !Array.isArray(data.options) || !data.systemResponse) {
      throw new Error('Invalid response format from API');
    }

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
      const errorData = await apiResponse.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    return data;
  } catch (error) {
    console.error('Error analyzing response:', error);
    throw error;
  }
}