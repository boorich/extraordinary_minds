'use client';

import { create } from 'zustand';
import { RFQ_SECTIONS } from '../rfq/prompts';
import { 
  RFQSection, 
  SectionId, 
  RFQResponse, 
  Message, 
  RFQInsight, 
  RFQState 
} from '../rfq/types';

interface RFQStore extends RFQState {
  addMessage: (message: Message) => void;
  addResponse: (sectionId: SectionId, response: RFQResponse) => void;
  nextSection: () => void;
  previousSection: () => void;
  getCurrentSection: () => RFQSection;
  isComplete: () => boolean;
  addInsight: (insight: RFQInsight) => void;
  updateRequirements: (reqs: RFQState['requirements']) => void;
}

export const useRFQStore = create<RFQStore>((set, get) => ({
  currentSection: 0,
  messages: [],
  requirements: [],
  insights: [],
  responses: {},

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  addResponse: (sectionId, response) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [sectionId]: response
      }
    }));
  },

  updateRequirements: (requirements) => set(() => ({
    requirements
  })),

  addInsight: (insight) => set((state) => ({
    insights: [...state.insights, insight]
  })),

  nextSection: () => {
    set((state) => ({
      currentSection: Math.min(state.currentSection + 1, RFQ_SECTIONS.length - 1)
    }));
  },

  previousSection: () => {
    set((state) => ({
      currentSection: Math.max(state.currentSection - 1, 0)
    }));
  },

  getCurrentSection: () => {
    return RFQ_SECTIONS[get().currentSection];
  },

  isComplete: () => {
    const { responses } = get();
    return RFQ_SECTIONS.every(section => 
      !section.required || responses[section.id]
    );
  }
}));