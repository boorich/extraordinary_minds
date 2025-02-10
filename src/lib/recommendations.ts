import { NetworkData } from '@/types/network';
import { inferCategory } from './categorize';

export interface CategoryCounts {
    'data-source': number;
    'cloud-service': number;
    'client-tool': number;
    'other': number;
}

export function analyzeNetworkCategories(network: NetworkData): CategoryCounts {
    const counts: CategoryCounts = {
        'data-source': 0,
        'cloud-service': 0,
        'client-tool': 0,
        'other': 0
    };

    // Count components by inferred category
    network.nodes.forEach(node => {
        if (node.metadata) {
            const category = inferCategory(node.metadata);
            counts[category]++;
        }
    });

    return counts;
}