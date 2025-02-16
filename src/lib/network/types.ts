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

export interface NetworkMetadata {
  /* Base Network metadata */
  components?: Record<string, ComponentMetadata>;
  /* Feature-specific metadata */
  [key: string]: any;
}