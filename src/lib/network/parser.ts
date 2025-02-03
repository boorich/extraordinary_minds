export interface NetworkUpdateComponent {
  id: string;
  size: number;
}

interface ParsedComponent {
  id: string | number;
  size: string | number;
}

export interface NetworkUpdate {
  llm_clients?: NetworkUpdateComponent[];
  ai_models?: NetworkUpdateComponent[];
  company_resources?: NetworkUpdateComponent[];
}

export function extractNetworkUpdate(content: string): NetworkUpdate | null {
  try {
    const netMatch = content.match(/<MCP_NET>\s*({[\s\S]*?})\s*<\/MCP_NET>/);
    if (!netMatch) {
      console.log('No network update found in response. Content:', content);
      console.log('Regex match result:', netMatch);
      return null;
    }

    const jsonStr = netMatch[1];
    console.log('Found network update JSON:', jsonStr);

    const parsed = JSON.parse(jsonStr);
    console.log('Parsed network update:', parsed);
    
    // Validate structure
    const update: NetworkUpdate = {
      llm_clients: parsed.llm_clients?.map((c: ParsedComponent) => 
        ({ id: String(c.id), size: Number(c.size) })) || [],
      ai_models: parsed.ai_models?.map((m: ParsedComponent) => 
        ({ id: String(m.id), size: Number(m.size) })) || [],
      company_resources: parsed.company_resources?.map((r: ParsedComponent) => 
        ({ id: String(r.id), size: Number(r.size) })) || []
    };
    
    console.log('Validated network update:', update);
    return update;
  } catch (e) {
    console.error('Failed to parse network update:', e);
    return null;
  }
}