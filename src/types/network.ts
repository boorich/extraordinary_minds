export interface NetworkNode {
  id: string;
  height: number;
  size: number;
  color: string;
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