import { NetworkData } from '@/types/network';

export interface ToolRecommendation {
  title: string;
  description: string;
  requiresDevelopment: boolean;
  category: 'rag' | 'functions' | 'applications';
  existingTool?: string;
}

function countNodesByType(networkData: NetworkData, type: string): number {
  return networkData.nodes.filter(node => node.metadata?.type === type).length;
}

export function analyzeNetworkForTooling(networkData: NetworkData): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = [];
  
  // Check database components
  const dbNodes = networkData.nodes.filter(node => 
    node.id.includes('DB') || 
    node.id.includes('SQL') || 
    node.id.includes('PostgreSQL') ||
    node.id.includes('HANA')
  );
  
  if (dbNodes.length > 0) {
    recommendations.push({
      title: "Database Integration",
      description: `Unified access layer for ${dbNodes.length} database systems: ${dbNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: false,
      category: 'rag',
      existingTool: "Enterprise DB Connector"
    });
  } else {
    recommendations.push({
      title: "Vector Database Integration",
      description: `Network storage for ${networkData.nodes.length} components`,
      requiresDevelopment: false,
      category: 'rag',
      existingTool: "Pinecone MCP Server"
    });
  }

  // API Gateway requirements
  const apiNodes = networkData.nodes.filter(node => 
    node.id.includes('API') || 
    node.id.includes('REST') || 
    node.id.includes('GraphQL')
  );

  if (apiNodes.length > 0) {
    recommendations.push({
      title: "API Gateway",
      description: `Integration hub for ${apiNodes.length} API endpoints: ${apiNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: true,
      category: 'functions'
    });
  } else {
    recommendations.push({
      title: "API Gateway",
      description: `Managing ${networkData.links.length} connections`,
      requiresDevelopment: true,
      category: 'functions'
    });
  }

  // Process automation needs
  const erpNodes = networkData.nodes.filter(node => 
    node.id.includes('ERP') || 
    node.id.includes('SAP') || 
    node.id.includes('S/4')
  );

  if (erpNodes.length > 0) {
    recommendations.push({
      title: "Process Automation",
      description: `Enterprise workflow automation for ${erpNodes.length} systems: ${erpNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: false,
      category: 'applications',
      existingTool: "JetBrains MCP Server"
    });
  } else {
    recommendations.push({
      title: "Process Automation",
      description: "Execute and monitor enterprise workflows",
      requiresDevelopment: false,
      category: 'applications',
      existingTool: "JetBrains MCP Server"
    });
  }

  return recommendations;
}

export function getToolsByCategory(recommendations: ToolRecommendation[], category: string) {
  return recommendations.filter(tool => tool.category === category);
}

export function generateCardContent(recommendations: ToolRecommendation[]) {
  const cardContent = {
    rag: {
      title: "Data Integration",
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
      title: "System Integration",
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