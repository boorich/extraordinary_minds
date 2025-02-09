export interface CardItem {
  title: string;
  description: string;
}

export interface CardSectionProps {
  title?: string;
  items: Array<CardItem | string>;
  variant?: 'default' | 'crew';
}

export interface NetworkData {
  nodes: any[];
  edges: any[];
  // Add other network-specific properties as needed
}

export interface MCPTool {
  name: string;
  description: string;
  category: 'rag' | 'functions' | 'applications';
  isCustom: boolean;
}