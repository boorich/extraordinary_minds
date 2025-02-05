export interface ComponentMetadata {
  title?: string;
  description?: string;
  icon?: string;
  details?: Record<string, string>;
  type?: string;
  parent?: string;
}

export interface NetworkUpdateComponent extends ComponentMetadata {
  id: string;
  size: number;
  height: number;
  color: string;
}