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

export interface RFQState {
  currentSection: number;
  responses: Partial<Record<SectionId, RFQResponse>>;
}