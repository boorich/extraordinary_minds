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
  generateDynamicOptions(input: string): any[];
  determineNextTheme(input: string): string;
  generateResponse(input: string, theme: string, round: number): Promise<{
    options: any[];
    nextTheme: string;
    systemResponse: string;
  }>;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SkillScores {
  // MCP specific scores
  understanding?: number;
  potential?: number;
  readiness?: number;
  investment?: number;
  
  // Legacy scores (optional)
  technical?: number;
  philosophical?: number;
  creative?: number;
  analytical?: number;
}