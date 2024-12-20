export interface DialoguePrompt {
  id?: string; // Made optional to support both old and new formats
  text: string;
  context?: string;
  theme?: string;
  constraints?: string[];
  isSystemMessage?: boolean;
  fallbackOptions?: DialogueOption[];
}

export interface DialogueOption {
  text: string;
  value?: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  score?: number;
}

export interface DialogueMetrics {
  choices: DialogueOption[];
  scores: DialogueState;
  startTime: number;
  endTime: number;
  evaluationScore?: number;
}

export interface DialogueState {
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