export interface DialogueOption {
  text: string;
  type: 'technical' | 'philosophical' | 'creative' | 'analytical';
  nextPrompt?: string;  // ID of the next prompt if static, undefined if dynamic
  score: number;        // Impact on the respective type score
}

export interface DialoguePrompt {
  id: string;
  text: string;
  options: DialogueOption[];
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
  timestamp: number;
  responseTime: number;
}

export interface DialogueMetrics {
  state: DialogueState;
  history: DialogueHistoryEntry[];
  startTime: number;
  averageResponseTime: number;
}