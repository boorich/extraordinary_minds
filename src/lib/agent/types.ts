export interface AgentConfig {
  name: string;
  modelProvider: string;
  settings: {
    defaultModel: string;
    fallbackModel: string;
    escalationModel: string;
    escalationTriggers: string[];
  };
  system: string;
  bio: string[];
  messageExamples: Array<{
    type: string;
    examples: Array<{
      input: string;
      response: string;
    }>;
  }>;
  style: {
    all: string[];
  };
  topics: string[];
}

export interface AgentContext {
  currentTheme: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userMetrics: Record<string, number>;
}

export interface AgentResponse {
  text: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  nextTheme?: string;
}