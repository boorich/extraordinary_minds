export interface ComponentMetadata {
  title?: string;
  description?: string;
  icon?: string;
  type?: string;
  parent?: string;
  details?: Record<string, string> | string[];
}

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