import { create } from 'zustand';
import { RFQ_SECTIONS } from './prompts';
import { RFQResponse, SectionId, RFQState } from './types';

interface RFQStore extends RFQState {
  addResponse: (sectionId: SectionId, response: RFQResponse) => void;
  nextSection: () => void;
  previousSection: () => void;
  getCurrentSection: () => (typeof RFQ_SECTIONS)[0];
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