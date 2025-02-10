import { NetworkData } from '@/types/network';

export interface ToolRecommendation {
  title: string;
  description: string;
  requiresDevelopment: boolean;
  category: 'rag' | 'functions' | 'applications';
  existingTool?: string;
}

export function analyzeNetworkForTooling(networkData: NetworkData): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = [
    {
      title: "Vector Database Integration",
      description: `Network storage for ${networkData.nodes.length} components`,
      requiresDevelopment: false,
      category: 'rag',
      existingTool: "Pinecone MCP Server"
    },
    {
      title: "API Gateway",
      description: `Managing ${networkData.links.length} connections`,
      requiresDevelopment: true,
      category: 'functions'
    },
    {
      title: "Process Automation",
      description: "Execute and monitor enterprise workflows",
      requiresDevelopment: false,
      category: 'applications',
      existingTool: "JetBrains MCP Server"
    }
  ];

  return recommendations;
}

export function getToolsByCategory(recommendations: ToolRecommendation[], category: string) {
  return recommendations.filter(tool => tool.category === category);
}

export function generateCardContent(recommendations: ToolRecommendation[]) {
  const cardContent = {
    rag: {
      title: "Seamless Integration",
      description: getToolsByCategory(recommendations, 'rag')
        .map(tool => {
          const toolName = tool.existingTool ? ` (${tool.existingTool})` : '';
          const status = tool.requiresDevelopment ? '[To Build]' : '[Available]';
          return `${status} ${tool.title}${toolName}: ${tool.description}`;
        })
        .join('\n\n')
    },
    functions: {
      title: "AI Enhancement",
      description: getToolsByCategory(recommendations, 'functions')
        .map(tool => {
          const toolName = tool.existingTool ? ` (${tool.existingTool})` : '';
          const status = tool.requiresDevelopment ? '[To Build]' : '[Available]';
          return `${status} ${tool.title}${toolName}: ${tool.description}`;
        })
        .join('\n\n')
    },
    applications: {
      title: "Secure Foundation",
      description: getToolsByCategory(recommendations, 'applications')
        .map(tool => {
          const toolName = tool.existingTool ? ` (${tool.existingTool})` : '';
          const status = tool.requiresDevelopment ? '[To Build]' : '[Available]';
          return `${status} ${tool.title}${toolName}: ${tool.description}`;
        })
        .join('\n\n')
    }
  };

  return cardContent;
}