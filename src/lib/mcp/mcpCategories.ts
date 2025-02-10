export interface MCPTool {
  name: string;
  description: string;
  type: 'data' | 'cloud' | 'client';
  available: boolean;
}

export function categorizeMCPTools() {
  return {
    data: [
      { 
        name: 'Notion Integration',
        description: 'Access and manage your company\'s Notion workspace',
        available: true
      },
      {
        name: 'PostgreSQL Access',
        description: 'Read-only database access with schema inspection',
        available: true
      },
      {
        name: 'MongoDB Connector',
        description: 'Schema-aware database operations and querying',
        available: true
      }
    ],
    cloud: [
      {
        name: 'GitHub Automation',
        description: 'Repository management and GitHub API integration',
        available: true
      },
      {
        name: 'AWS Integration',
        description: 'Manage AWS resources and services',
        available: true
      },
      {
        name: 'Kubernetes Control',
        description: 'Pod deployment and service management',
        available: true
      }
    ],
    client: [
      {
        name: 'File System Access',
        description: 'Secure file operations with configurable access controls',
        available: true
      },
      {
        name: 'Browser Automation',
        description: 'Control web browsers for testing and automation',
        available: true
      },
      {
        name: 'Git Integration',
        description: 'Local repository management and operations',
        available: true
      }
    ]
  };
}

export function generateCardContent() {
  const tools = categorizeMCPTools();
  
  return {
    data: {
      title: 'Data Access',
      description: tools.data.map(tool => 
        `[${tool.available ? 'Available' : 'To Build'}] ${tool.name}: ${tool.description}`
      ).join('\n\n')
    },
    cloud: {
      title: 'Cloud Automation',
      description: tools.cloud.map(tool => 
        `[${tool.available ? 'Available' : 'To Build'}] ${tool.name}: ${tool.description}`
      ).join('\n\n')
    },
    client: {
      title: 'Client Automation',
      description: tools.client.map(tool => 
        `[${tool.available ? 'Available' : 'To Build'}] ${tool.name}: ${tool.description}`
      ).join('\n\n')
    }
  };
}