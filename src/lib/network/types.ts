export interface ComponentMetadata {
  title?: string;
  description?: string;
  icon?: string;
  type?: string;
  parent?: string;
  details?: Record<string, string> | string[];  // Allow both formats
}