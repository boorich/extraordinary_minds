export interface DialoguePrompt {
  id: string;
  text: string;
  theme: string;
  context: string;
  constraints: string[];
  isSystemMessage?: boolean;
  fallbackOptions?: Array<{
    text: string;
    type: 'technical' | 'philosophical' | 'creative' | 'analytical';
    score: number;
  }>;
}

export interface DialogueOption {
  text: string;
  value: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
}

export interface DialogueMetrics {
  choices: DialogueOption[];
  scores: DialogueState;
  startTime: number;
  endTime: number;
  evaluationScore?: number;
}

export interface DialogueState {
  // Legacy evaluation metrics
  technical?: number;
  philosophical?: number;
  creative?: number;
  analytical?: number;
  // MCP dialogue metrics
  understanding?: number;
  potential?: number;
  readiness?: number;
  investment?: number;
  technical: number;
  philosophical: number;
  creative: number;
  analytical: number;
  evaluationPassed?: boolean;
  failureReason?: string;
}

export interface DialogueResponse {
  content: string;
  isValid: boolean;
  evaluationScore: number;
  failureReason?: string;
}

export interface ConversationDetail {
  question: string;
  response: string;
  score: number;
  skillScores: {
    technical: number;
    philosophical: number;
    creative: number;
    analytical: number;
  };
}

export interface ConversationDetails {
  conversations: ConversationDetail[];
  skillScores: DialogueState;
}