export interface RFQInsight {
  type: 'warning' | 'info' | 'success';
  message: string;
  details?: string;
}

export interface RFQComponents {
  insights: RFQInsight[];
  requirements?: Record<string, any>;
}

export interface RFQMetadata {
  rfq_components?: RFQComponents;
}