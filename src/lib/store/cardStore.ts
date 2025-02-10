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
      description: 'Transform your existing data sources into AI-ready interfaces:
• Connect to Notion workspaces for knowledge sharing
• Query databases (PostgreSQL, MongoDB) with natural language
• Access document management systems securely
• Extract insights from company wikis and knowledge bases'
    },
    cloud: {
      title: 'Cloud Automation',
      description: 'Automate your cloud infrastructure through natural language:
• Deploy and manage GitHub repositories and pull requests
• Control AWS services and resources
• Manage Kubernetes clusters and deployments
• Integrate with cloud APIs and services'
    },
    client: {
      title: 'Client Automation',
      description: 'Control desktop tools and applications via chat:
• Access local files and directories securely
• Automate browser-based testing and workflows
• Manage local Git repositories
• Control desktop applications like CAD, IDEs, and design tools'
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