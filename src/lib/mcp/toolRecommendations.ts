import { MCPTool } from '@/types';

export interface ToolRecommendation {
  title: string;
  description: string;
  requiresDevelopment: boolean;
  category: 'rag' | 'functions' | 'applications';
  existingTool?: string;  // If we can use an existing MCP tool
}

export function analyzeNetworkForTooling(networkData: any): ToolRecommendation[] {
  const recommendations: ToolRecommendation[] = [
    // RAG Tools
    {
      title: "Vector Database Integration",
      description: "Semantic search and retrieval for conversation history and contextual data",
      requiresDevelopment: false,
      category: 'rag',
      existingTool: "Pinecone MCP Server"
    },
    {
      title: "Document Processing",
      description: "Parse and process various document formats for knowledge extraction",
      requiresDevelopment: false,
      category: 'rag',
      existingTool: "Markdownify MCP Server"
    },
    {
      title: "Network Graph Memory",
      description: "Specialized graph database for storing and querying conversation flows",
      requiresDevelopment: true,
      category: 'rag'
    },

    // Function Tools
    {
      title: "API Gateway",
      description: "Secure gateway for enterprise API access with rate limiting and monitoring",
      requiresDevelopment: true,
      category: 'functions'
    },
    {
      title: "Model Selection API",
      description: "Dynamic model selection based on conversation complexity",
      requiresDevelopment: false,
      category: 'functions',
      existingTool: "Any Chat Completions MCP Server"
    },
    {
      title: "Authentication Bridge",
      description: "Enterprise SSO integration for secure model access",
      requiresDevelopment: true,
      category: 'functions'
    },

    // Application Tools
    {
      title: "Process Automation",
      description: "Execute and monitor enterprise workflows",
      requiresDevelopment: false,
      category: 'applications',
      existingTool: "JetBrains MCP Server"
    },
    {
      title: "Compliance Logger",
      description: "Audit logging for all model interactions and tool usage",
      requiresDevelopment: true,
      category: 'applications'
    },
    {
      title: "Resource Monitor",
      description: "Track and optimize resource usage across the network",
      requiresDevelopment: true,
      category: 'applications'
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
      description: formatToolsDescription(getToolsByCategory(recommendations, 'rag'))
    },
    functions: {
      title: "AI Enhancement",
      description: formatToolsDescription(getToolsByCategory(recommendations, 'functions'))
    },
    applications: {
      title: "Secure Foundation",
      description: formatToolsDescription(getToolsByCategory(recommendations, 'applications'))
    }
  };

  return cardContent;
}

function formatToolsDescription(tools: ToolRecommendation[]): string {
  return tools.map(tool => {
    if (tool.requiresDevelopment) {
      return `[To Build] ${tool.title}: ${tool.description}`;
    }
    return `[Available] ${tool.title} (${tool.existingTool}): ${tool.description}`;
  }).join('\n\n');
}