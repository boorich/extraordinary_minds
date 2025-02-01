export interface DialoguePrompt {
  id?: string;                   // Identifier for the dialogue
  text: string;                  // The actual dialogue text
  theme?: string;                // Theme or topic of the dialogue
  context?: string;              // Additional context for the dialogue
  constraints?: string[];        // Rules or constraints for responses
  isSystemMessage?: boolean;     // Whether this is a system message
  options?: DialogueOption[];    // Possible response options
  fallbackOptions?: DialogueOption[]; // Default options if none are generated
  evaluation?: string;           // Evaluation criteria
}

export interface DialogueOption {
  text: string;
  nextPrompt?: string;
  value: string;
  score?: number;
  type?: string; // Category or type of response
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