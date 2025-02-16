import { create } from 'zustand';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RFQRequirement {
  category: string;
  details: string;
  isValid: boolean;
  suggestions?: string[];
}

export interface Insight {
  type: 'warning' | 'info' | 'success';
  message: string;
  details?: string;
}

interface RFQStore {
  messages: Message[];
  requirements: RFQRequirement[];
  insights: Insight[];
  addMessage: (message: Message) => void;
  updateRequirements: (requirements: RFQRequirement[]) => void;
  addInsight: (insight: Insight) => void;
  clearInsights: () => void;
  reset: () => void;
}

export const useRFQStore = create<RFQStore>((set) => ({
  messages: [],
  requirements: [],
  insights: [],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  updateRequirements: (requirements) => set(() => ({
    requirements
  })),
  
  addInsight: (insight) => set((state) => ({
    insights: [...state.insights, insight]
  })),
  
  clearInsights: () => set(() => ({
    insights: []
  })),
  
  reset: () => set(() => ({
    messages: [],
    requirements: [],
    insights: []
  }))
}));