import { NetworkUpdate, NetworkUpdateComponent } from './parser';

const PATTERNS = {
  ai_models: {
    patterns: [
      { match: /translation|language|mandarin|chinese/i, id: "Translation AI", size: 24, height: 1 },
      { match: /chat(gpt|bot)/i, id: "Chat Models", size: 20, height: 1 },
      { match: /machine learning|ml|ai model/i, id: "ML Models", size: 20, height: 1 }
    ]
  },
  company_resources: {
    patterns: [
      { match: /sap/i, id: "SAP System", size: 24, height: 1 },
      { match: /database|data/i, id: "Enterprise Data", size: 20, height: 1 },
      { match: /api|interface|integration/i, id: "APIs", size: 20, height: 1 }
    ]
  },
  llm_clients: {
    patterns: [
      { match: /tool|client|interface/i, id: "MCP Tools", size: 24, height: 1 },
      { match: /browser|web/i, id: "Web Interface", size: 20, height: 1 },
      { match: /mobile|app/i, id: "Mobile Client", size: 20, height: 1 }
    ]
  }
};

export function analyzeContent(content: string): NetworkUpdate {
  const result: NetworkUpdate = {
    ai_models: [],
    company_resources: [],
    llm_clients: []
  };

  // For each category
  Object.entries(PATTERNS).forEach(([category, { patterns }]) => {
    // Check each pattern in the category
    patterns.forEach(pattern => {
      if (pattern.match.test(content)) {
        // Add component if not already present
        const component: NetworkUpdateComponent = {
          id: pattern.id,
          size: pattern.size,
          height: pattern.height,
          color: "rgb(232, 193, 160)"
        };
        
        const categoryArray = result[category as keyof NetworkUpdate] || [];
        if (!categoryArray.some(existing => existing.id === component.id)) {
          categoryArray.push(component);
        }
        result[category as keyof NetworkUpdate] = categoryArray;
      }
    });
  });

  return result;
}