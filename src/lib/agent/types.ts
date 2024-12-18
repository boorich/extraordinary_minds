export interface Character {
  name: string;
  plugins: string[];
  clients: string[];
  modelProvider: string;
  settings: {
    secrets: Record<string, string>;
    voice?: {
      model: string;
    };
  };
  system: string;
  bio: string[];
  messageExamples: Array<Array<{
    user: string;
    content: {
      text: string;
      action?: string;
    };
  }>>;
  style: {
    all: string[];
    chat?: string[];
    post?: string[];
  };
  topics?: string[];
}

export interface AgentContext {
  currentTheme: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userMetrics: Record<string, number>;
}

export interface AgentType {
  getProfileGenerationPrompt(): string;
  generateExplorerName(): string;
  generateResponse(input: string, theme: string, round: number): Promise<{
    options: any[];
    nextTheme: string;
    systemResponse: string;
  }>;
  generateDynamicOptions(input: string): any[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}