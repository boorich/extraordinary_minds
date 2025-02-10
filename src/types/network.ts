export interface ComponentMetadata {
  title?: string;
  description?: string;
  icon?: string;
  type?: string;
  parent?: string;
  details?: Record<string, string> | string[];
}

// Just adding the type, no usage yet
export type ComponentCategory = 
  | 'data-source'     // Databases, document systems, etc.
  | 'cloud-service'   // APIs, cloud resources
  | 'client-tool'     // Applications, interfaces
  | 'other';          // Fallback

export interface NetworkNode {
  id: string;
  height: number;
  size: number;
  color: string;
  metadata?: ComponentMetadata;
}

export interface NetworkLink {
  source: string;
  target: string;
  distance: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}