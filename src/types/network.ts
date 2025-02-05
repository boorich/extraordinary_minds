import { NodeMetadata } from '@/lib/patterns';

export interface NetworkNode {
  id: string;
  height: number;
  size: number;
  color: string;
  metadata?: NodeMetadata;
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