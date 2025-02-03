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
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[1]);
    return parsed.networkUpdate;
  } catch (e) {
    console.error('Failed to parse network update:', e);
    return null;
  }
}