import { create } from 'zustand';
import { NetworkData } from '@/types/network';
import { generateCardContent } from '@/lib/mcp/mcpCategories';

interface CardState {
  cardContent: {
    data: { title: string; description: string };
    cloud: { title: string; description: string };
    client: { title: string; description: string };
  };
  updateFromNetwork: (networkData: NetworkData) => void;
}

export const useCardStore = create<CardState>((set, get) => ({
  cardContent: {
    data: { title: '', description: '' },
    cloud: { title: '', description: '' },
    client: { title: '', description: '' }
  },
  updateFromNetwork: (networkData: NetworkData) => {
    console.log('Store: Processing update with network data:', {
      nodeCount: networkData.nodes.length,
      linkCount: networkData.links.length
    });
    
    const cardContent = generateCardContent();
    const prevState = get();
    console.log('Previous state:', prevState);
    console.log('New card content:', cardContent);
    
    set({
      cardContent: {
        data: { ...cardContent.data },
        cloud: { ...cardContent.cloud },
        client: { ...cardContent.client }
      }
    });
    
    console.log('State after update:', get());
  }
}));