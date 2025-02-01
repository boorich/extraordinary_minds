export interface DialoguePrompt {
  text: string;
  options?: DialogueOption[];
  evaluation?: string;
}

export interface DialogueOption {
  text: string;
  nextPrompt?: string;
  value: string;
  score?: number;
}

export interface DialogueMetrics {
  choices?: DialogueOption[];
  scores?: DialogueState;
  startTime?: number;
  endTime?: number;
  evaluationScore?: number;
}

export interface DialogueState {
  // MCP dialogue metrics
  understanding?: number;
  potential?: number;
  readiness?: number;
  investment?: number;
  
  // Optional legacy metrics (for backward compatibility)
  technical?: number;
  philosophical?: number;
  creative?: number;
  analytical?: number;
  
  evaluationPassed?: boolean;
  failureReason?: string;
}

export interface ConversationDetails {
  conversations: {
    question: string;
    response: string;
    score: number;
  }[];
  skillScores: DialogueState;
}

export interface GenerationData {
  neuralProfile: string;
  explorerClass: string;
  vesselLogs: string[];
}