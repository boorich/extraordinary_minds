import { ComponentMetadata, ComponentCategory } from '@/types/network';

export function inferCategory(metadata: ComponentMetadata): ComponentCategory {
    // Look at all metadata text fields for category clues
    const text = [
        metadata.type,
        metadata.description,
        metadata.title,
        ...(Array.isArray(metadata.details) ? metadata.details : Object.values(metadata.details || {}))
    ]
        .filter(Boolean)  // Remove undefined/null
        .map(s => s?.toString().toLowerCase())
        .join(' ');

    // Simple pattern matching
    if (text.match(/database|data|storage|document|knowledge base/)) return 'data-source';
    if (text.match(/api|service|cloud|workflow/)) return 'cloud-service';
    if (text.match(/app|tool|interface|client|desktop/)) return 'client-tool';
    
    return 'other';
}