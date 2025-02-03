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
    const netMatch = content.match(/<MCP_NET>\s*({[\s\S]*?})\s*<\/MCP_NET>/);
    if (!netMatch) return null;

    const parsed = JSON.parse(netMatch[1]);
    
    // Validate structure
    const update: NetworkUpdate = {
      llm_clients: parsed.llm_clients?.map(c => ({ id: String(c.id), size: Number(c.size) })) || [],
      ai_models: parsed.ai_models?.map(m => ({ id: String(m.id), size: Number(m.size) })) || [],
      company_resources: parsed.company_resources?.map(r => ({ id: String(r.id), size: Number(r.size) })) || []
    };
    
    return update;
  } catch (e) {
    console.error('Failed to parse network update:', e);
    return null;
  }
}