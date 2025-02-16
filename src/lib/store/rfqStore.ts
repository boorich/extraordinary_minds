'use client';

import { create } from 'zustand';
import { RFQ_SECTIONS } from '../rfq/prompts';
import { RFQSection, SectionId, RFQResponse } from '../rfq/types';

interface RFQStore {
  currentSection: number;
  responses: Partial<Record<SectionId, RFQResponse>>;
  addResponse: (sectionId: SectionId, response: RFQResponse) => void;
  nextSection: () => void;
  previousSection: () => void;
  getCurrentSection: () => RFQSection;
  isComplete: () => boolean;
}

export const useRFQStore = create<RFQStore>((set, get) => ({
  currentSection: 0,
  responses: {},

  addResponse: (sectionId, response) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [sectionId]: response
      }
    }));
  },

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