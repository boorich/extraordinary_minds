import { NetworkData } from '@/types/network';

export interface ToolRecommendation {
  title: string;
  description: string;
  requiresDevelopment: boolean;
  category: 'data' | 'cloud' | 'client';
  existingTool?: string;
}

function countNodesByType(networkData: NetworkData, type: string): number {
  return networkData.nodes.filter(node => node.metadata?.type === type).length;
}

export function analyzeNetworkForTooling(networkData: NetworkData): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = [];
  
  // Data Layer Analysis
  const dataNodes = networkData.nodes.filter(node => 
    node.id.includes('DB') || 
    node.id.includes('SQL') ||
    node.id.includes('PostgreSQL') ||
    node.id.includes('HANA') ||
    node.id.includes('Notion') ||
    node.id.includes('Document')
  );
  
  if (dataNodes.length > 0) {
    recommendations.push({
      title: "Data Integration",
      description: `Connect to ${dataNodes.length} data sources: ${dataNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: false,
      category: 'data',
      existingTool: "Enterprise Data Hub"
    });
  }

  // Cloud Service Analysis
  const cloudNodes = networkData.nodes.filter(node => 
    node.id.includes('API') || 
    node.id.includes('REST') || 
    node.id.includes('Cloud') ||
    node.id.includes('AWS') ||
    node.id.includes('Azure')
  );

  if (cloudNodes.length > 0) {
    recommendations.push({
      title: "Cloud Automation",
      description: `Integrate with ${cloudNodes.length} cloud services: ${cloudNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: true,
      category: 'cloud'
    });
  }

  // Client Tool Analysis
  const clientNodes = networkData.nodes.filter(node => 
    node.id.includes('Desktop') || 
    node.id.includes('Local') || 
    node.id.includes('Client') ||
    node.id.includes('IDE')
  );

  if (clientNodes.length > 0) {
    recommendations.push({
      title: "Client Integration",
      description: `Enable automation for ${clientNodes.length} client applications: ${clientNodes.map(n => n.id).join(', ')}`,
      requiresDevelopment: false,
      category: 'client',
      existingTool: "Desktop Integration Hub"
    });
  }

  return recommendations;
}

export function generateCardContent(recommendations: ToolRecommendation[]) {
  // Initial state with category explanations
  const content = {
    data: {
      title: "Data Access",
      description: "Access company data through secure MCP servers that connect to various data sources like databases, knowledge bases, and document management systems."
    },
    cloud: {
      title: "Cloud Automation",
      description: "Integrate with cloud services and APIs to automate workflows and manage cloud resources across your infrastructure."
    },
    client: {
      title: "Client Automation",
      description: "Enable direct integration with desktop applications and local tools through secure MCP servers running on user systems."
    }
  };

  // If we have recommendations, update the descriptions
  if (recommendations.length > 0) {
    recommendations.forEach(rec => {
      const category = rec.category;
      const toolName = rec.existingTool ? ` (${rec.existingTool})` : '';
      const status = rec.requiresDevelopment ? '[To Build]' : '[Available]';
      const currentDesc = content[category].description;
      
      if (currentDesc.includes('[')) {
        content[category].description += `\n\n${status} ${rec.title}${toolName}: ${rec.description}`;
      } else {
        content[category].description = `${status} ${rec.title}${toolName}: ${rec.description}`;
      }
    });
  }

  return content;
}