import { NetworkUpdate, NetworkUpdateComponent } from './parser';
import { PATTERNS } from './patterns';

export function analyzeContent(content: string): NetworkUpdate {
  console.log('=== Network Analysis Start ===');
  console.log('Analyzing content:', content);
  
  const result: NetworkUpdate = {
    ai_models: [],
    company_resources: [],
    llm_clients: []
  };

  // For each major category (ai_models, company_resources, llm_clients)
  Object.entries(PATTERNS).forEach(([categoryKey, categoryData]) => {
    console.log(`\nChecking ${categoryKey} patterns:`);
    
    // For each category definition (Translation AI, Chat Models, etc)
    categoryData.categories.forEach(category => {
      // Check if any of the category patterns match
      const categoryMatches = category.patterns.some(pattern => {
        const matches = content.match(pattern);
        console.log(`- Pattern ${pattern}:`, matches);
        return matches;
      });

      if (categoryMatches) {
        // Add the category component if not already present
        const categoryComponent: NetworkUpdateComponent = {
          id: category.id,
          size: category.size,
          height: category.height,
          color: "rgb(232, 193, 160)"
        };
        
        const categoryArray = result[categoryKey as keyof NetworkUpdate] || [];
        if (!categoryArray.some(existing => existing.id === categoryComponent.id)) {
          categoryArray.push(categoryComponent);
          console.log(`  Added ${categoryComponent.id} to ${categoryKey}`);
        }
        
        // Check for implementations
        category.implementations.forEach(impl => {
          const implMatches = content.match(impl.match);
          if (implMatches) {
            const implComponent: NetworkUpdateComponent = {
              id: impl.id,
              size: impl.size,
              height: impl.height,
              color: "rgb(232, 193, 160)"
            };
            
            if (!categoryArray.some(existing => existing.id === implComponent.id)) {
              categoryArray.push(implComponent);
              console.log(`  Added implementation ${implComponent.id} to ${categoryKey}`);
            }
          }
        });

        result[categoryKey as keyof NetworkUpdate] = categoryArray;
      }
    });
  });

  console.log('\nFinal network update:', JSON.stringify(result, null, 2));
  console.log('=== Network Analysis End ===\n');
  return result;
}