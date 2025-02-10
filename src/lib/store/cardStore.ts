import { create } from 'zustand';
import { NetworkData } from '@/types/network';
import { analyzeNetworkForTooling, generateCardContent } from '@/lib/mcp/toolRecommendations';

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
    data: { 
      title: 'Data Access',
      description: 'Access company data through secure MCP servers that connect to various data sources like databases, knowledge bases, and document management systems.'
    },
    cloud: {
      title: 'Cloud Automation',
      description: 'Integrate with cloud services and APIs to automate workflows and manage cloud resources across your infrastructure.'
    },
    client: {
      title: 'Client Automation',
      description: 'Enable direct integration with desktop applications and local tools through secure MCP servers running on user systems.'
    }
  },
  updateFromNetwork: (networkData: NetworkData) => {
    console.log('Store: Processing update with network data:', {
      nodeCount: networkData.nodes.length,
      linkCount: networkData.links.length
    });
    
    const recommendations = analyzeNetworkForTooling(networkData);
    const cardContent = generateCardContent(recommendations);
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