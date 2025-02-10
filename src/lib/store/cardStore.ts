import { create } from 'zustand';
import { NetworkData } from '@/types/network';
import { ToolRecommendation, analyzeNetworkForTooling, generateCardContent } from '@/lib/mcp/toolRecommendations';

interface CardState {
  recommendations: ToolRecommendation[];
  cardContent: {
    rag: { title: string; description: string };
    functions: { title: string; description: string };
    applications: { title: string; description: string };
  };
  updateFromNetwork: (networkData: NetworkData) => void;
}

export const useCardStore = create<CardState>((set) => ({
  recommendations: [],
  cardContent: {
    rag: { title: '', description: '' },
    functions: { title: '', description: '' },
    applications: { title: '', description: '' }
  },
  updateFromNetwork: (networkData: NetworkData) => {
    const recommendations = analyzeNetworkForTooling(networkData);
    const cardContent = generateCardContent(recommendations);
    set({ recommendations, cardContent });
  }
}));