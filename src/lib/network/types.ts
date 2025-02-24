export interface ComponentMetadata {
  title?: string;
  description?: string;
  icon?: string;
  type?: string;
  parent?: string;
  details?: Record<string, string> | string[];  // Accept both formats
}

export interface NetworkNode {
  id: string;
  height: number;
  size: number;
  color: string;
  metadata?: ComponentMetadata;
}