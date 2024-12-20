export interface DialoguePrompt {
  text: string;
  context?: string;
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