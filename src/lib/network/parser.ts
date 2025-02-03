export interface NetworkUpdateComponent {
  id: string;
  size: number;
}

export interface NetworkUpdate {
  llm_clients?: NetworkUpdateComponent[];
  ai_models?: NetworkUpdateComponent[];
  company_resources?: NetworkUpdateComponent[];
}

export function extractNetworkUpdate(content: string): NetworkUpdate | null {
  try {
    const netMatch = content.match(/<MCP_NET>([\s\S]*?)<\/MCP_NET>/);
    if (!netMatch) return null;

    return JSON.parse(netMatch[1]);
  } catch (e) {
    console.error('Failed to parse network update:', e);
    return null;
  }
}