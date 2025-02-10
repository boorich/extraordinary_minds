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
    const dataSourceTypes = new Set(dataNodes.map(n => {
      if (n.id.includes('DB') || n.id.includes('SQL')) return 'database';
      if (n.id.includes('Notion')) return 'knowledge base';
      if (n.id.includes('Document')) return 'document store';
      if (n.id.includes('Wiki')) return 'wiki';
      return 'data source';
    }));

    recommendations.push({
      title: "Data Integration",
      description: `Enable AI-driven access to your ${Array.from(dataSourceTypes).join(', ')} systems. Natural language interface to ${dataNodes.length} connected data sources.`,
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
    const cloudTypes = new Set(cloudNodes.map(n => {
      if (n.id.includes('API')) return 'API service';
      if (n.id.includes('AWS')) return 'AWS resource';
      if (n.id.includes('Azure')) return 'Azure service';
      if (n.id.includes('Cloud')) return 'cloud platform';
      return 'service';
    }));

    recommendations.push({
      title: "Cloud Automation",
      description: `Natural language control for your ${Array.from(cloudTypes).join(', ')}s. Automate ${cloudNodes.length} services through chat.`,
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
    const clientTypes = new Set(clientNodes.map(n => {
      if (n.id.includes('Desktop')) return 'desktop app';
      if (n.id.includes('IDE')) return 'development tool';
      if (n.id.includes('Browser')) return 'browser';
      return 'application';
    }));

    recommendations.push({
      title: "Client Integration",
      description: `Control your ${Array.from(clientTypes).join(', ')}s through chat. Enable AI assistance for ${clientNodes.length} local tools.`,
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