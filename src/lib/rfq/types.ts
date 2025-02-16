export type SectionId = 
  | 'project_overview' 
  | 'scope' 
  | 'timeline' 
  | 'requirements' 
  | 'evaluation';

export interface RFQSection {
  id: SectionId;
  name: string;
  required: boolean;
  prompts: string[];
  dataHints: string[];
}

export interface RFQResponse {
  content: string;
  dataGaps: string[];
  confidence: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RFQInsight {
  type: 'warning' | 'info' | 'success';
  message: string;
  details?: string;
}

export interface RFQState {
  currentSection: number;
  messages: Message[];
  requirements: Array<{
    category: string;
    details: string;
    isValid: boolean;
    suggestions?: string[];
  }>;
  insights: RFQInsight[];
  responses: Partial<Record<SectionId, RFQResponse>>;
}