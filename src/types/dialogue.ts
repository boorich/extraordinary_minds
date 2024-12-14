export interface DialogueOption {
  text: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  score: number;
}

export interface DialoguePrompt {
  id: string;
  text: string;
  theme: string;
  context: string;
  constraints: string[];
  fallbackOptions: DialogueOption[];
  isSystemMessage?: boolean;
}

export interface DialogueState {
  technical: number;
  philosophical: number;
  creative: number;
  analytical: number;
}

export interface DialogueHistoryEntry {
  prompt: string;
  response: string;
  responseType?: 'technical' | 'philosophical' | 'creative' | 'analytical';
  timestamp: number;
  responseTime: number;
}

export interface DialogueMetrics {
  state: DialogueState;
  history: DialogueHistoryEntry[];
  startTime: number;
  averageResponseTime: number;
}

export interface GeneratedDialogueResponse {
  options: DialogueOption[];
  nextTheme: string;
}