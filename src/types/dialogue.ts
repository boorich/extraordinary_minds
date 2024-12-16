export interface DialogueOption {
  text: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  score: number;
  nextPrompt?: string;
}

export interface DialoguePrompt {
  id: string;
  text: string;
  theme: string;
  context: string;
  constraints: string[];
  options?: DialogueOption[];
  fallbackOptions: DialogueOption[];
  isSystemMessage?: boolean;
}

export interface DialogueState {
  technical: number;
  philosophical: number;
  creative: number;
  analytical: number;
}

export interface DialogueMetrics {
  choices: DialogueOption[];
  scores: DialogueState;
  startTime: number;
  endTime?: number;
}

export interface GeneratedDialogueResponse {
  options: DialogueOption[];
  nextTheme: string;
  systemResponse: string;
}