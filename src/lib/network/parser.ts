import { ComponentMetadata } from './types';

export interface NetworkUpdateComponent extends ComponentMetadata {
  id: string;
  size: number;
  height: number;
  color: string;
}

export interface NetworkUpdate {
  llm_clients?: NetworkUpdateComponent[];
  ai_models?: NetworkUpdateComponent[];
  company_resources?: NetworkUpdateComponent[];
}

export function extractNetworkUpdate(content: string): NetworkUpdate | null {
  try {
    // Try to extract JSON directly first
    const jsonMatch = content.match(/\{[\s\S]*"(?:llm_clients|ai_models|company_resources)"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (isValidNetworkUpdate(parsed)) {
        return addColors(parsed);
      }
    }
    
    // Fallback to MCP_NET tag extraction
    const tagMatch = content.match(/<MCP_NET>([\s\S]*?)<\/MCP_NET>/);
    if (tagMatch) {
      const parsed = JSON.parse(tagMatch[1]);
      if (isValidNetworkUpdate(parsed)) {
        return addColors(parsed);
      }
    }

    console.warn('No valid network update found in content');
    return null;
  } catch (e) {
    console.error('Failed to process network update:', e);
    return null;
  }
}

function isValidNetworkUpdate(obj: any): obj is NetworkUpdate {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const validCategories = ['llm_clients', 'ai_models', 'company_resources'];
  const hasValidCategory = validCategories.some(cat => Array.isArray(obj[cat]));
  
  if (!hasValidCategory) return false;
  
  for (const cat of validCategories) {
    if (obj[cat] && (!Array.isArray(obj[cat]) || !obj[cat].every(isValidComponent))) {
      return false;
    }
  }
  
  return true;
}

function isValidComponent(obj: any): obj is NetworkUpdateComponent {
  if (!obj || typeof obj !== 'object') return false;

  // Required fields
  const hasRequiredFields = 
    typeof obj.id === 'string' &&
    typeof obj.size === 'number' &&
    typeof obj.height === 'number' &&
    obj.size >= 12 && obj.size <= 32 &&
    obj.height >= 0 && obj.height <= 2;

  if (!hasRequiredFields) return false;

  // Optional metadata fields
  if (obj.title !== undefined && typeof obj.title !== 'string') return false;
  if (obj.description !== undefined && typeof obj.description !== 'string') return false;
  if (obj.icon !== undefined && typeof obj.icon !== 'string') return false;
  if (obj.type !== undefined && typeof obj.type !== 'string') return false;
  if (obj.parent !== undefined && typeof obj.parent !== 'string') return false;
  if (obj.details !== undefined && (typeof obj.details !== 'object' || Array.isArray(obj.details))) return false;

  return true;
}

function addColors(update: NetworkUpdate): NetworkUpdate {
  const withColors: NetworkUpdate = {};
  
  for (const [category, components] of Object.entries(update)) {
    if (Array.isArray(components)) {
      withColors[category as keyof NetworkUpdate] = components.map(comp => ({
        ...comp,
        color: comp.color || "rgb(232, 193, 160)"
      }));
    }
  }
  
  return withColors;
}