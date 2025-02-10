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

export const useCardStore = create<CardState>((set, get) => ({
  recommendations: [],
  cardContent: {
    rag: { title: '', description: '' },
    functions: { title: '', description: '' },
    applications: { title: '', description: '' }
  },
  updateFromNetwork: (networkData: NetworkData) => {
    console.log('=== Card Store: updateFromNetwork ===');
    console.log('Received network data:', networkData);
    if (!networkData?.nodes?.length) {
      console.log('No valid network data, skipping update');
      return;
    }
    console.log('Processing update in store...');
    const recommendations = analyzeNetworkForTooling(networkData);
    const cardContent = generateCardContent(recommendations);
    const prevState = get();
    console.log('Previous state:', prevState);
    console.log('New recommendations:', recommendations);
    console.log('New card content:', cardContent);
    
    set({
      recommendations,
      cardContent: {
        ...cardContent,
        rag: { ...cardContent.rag },
        functions: { ...cardContent.functions },
        applications: { ...cardContent.applications }
      }
    });
    
    console.log('State after update:', get());
  }
}));