import { NetworkUpdate, NetworkUpdateComponent } from './parser';
import { PATTERNS, PatternImplementation } from './patterns';
import { OpenRouterApi } from '../openrouter';

const openRouter = new OpenRouterApi('');

const EXTRACTION_PROMPT = `Analyze the following text and extract technical components in these categories:
1. LLM Clients: tools, interfaces, user touchpoints
2. AI Models: ML capabilities, language models, specialized AI
3. Company Resources: systems, data, APIs being integrated

For each component, specify:
Required:
- id: kebab-case identifier
- size (12-32): importance/centrality score
- height (0-2): hierarchy level (0: specific instance, 1: group, 2: category)

Optional metadata:
- title: human-readable name
- description: short explanation
- icon: suggested icon name
- type: component classification
- parent: id of parent component
- details: key-value pairs of additional info

Return strictly in this format:
{
  "llm_clients": [{
    "id": "component-id",
    "size": 24,
    "height": 1,
    "title": "Component Name",
    "description": "What it does",
    "icon": "icon-name",
    "type": "classification",
    "parent": "parent-id",
    "details": {"key": "value"}
  }],
  "ai_models": [...],
  "company_resources": [...]
}`;

export async function analyzeContent(content: string): Promise<NetworkUpdate> {
  console.log('=== Network Analysis Start ===');
  
  try {
    // First pass: Extract components using LLM
    const completion = await openRouter.createCompletion({
      model: 'anthropic/claude-3-sonnet-20240229',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content }
      ],
      temperature: 0, // Set to 0 for deterministic output
      max_tokens: 500
    });

    const llmResponse = completion.choices[0].message.content;
    console.log('LLM Extraction:', llmResponse);

    // Parse LLM response
    const extractedComponents = JSON.parse(llmResponse);

    // Second pass: Validate against patterns
    const result: NetworkUpdate = {
      ai_models: [],
      company_resources: [],
      llm_clients: []
    };

    // Sort function for components
    const sortComponents = (a: NetworkUpdateComponent, b: NetworkUpdateComponent) => {
      // First sort by height (descending)
      if (b.height !== a.height) return b.height - a.height;
      // Then by size (descending)
      if (b.size !== a.size) return b.size - a.size;
      // Finally by id (ascending) for consistent ordering
      return a.id.localeCompare(b.id);
    };

    // Process each category
    Object.entries(extractedComponents).forEach(([category, components]) => {
      const categoryArray = result[category as keyof NetworkUpdate] || [];
      (components as NetworkUpdateComponent[]).forEach(component => {
        // Validate component exists in patterns and get metadata
        let validComponent: NetworkUpdateComponent | null = null;
        
        // Check all categories and implementations
        Object.values(PATTERNS).forEach(categoryData => {
          categoryData.categories.forEach(cat => {
            if (cat.id === component.id) {
              validComponent = {
                ...cat,
                ...component,
                color: "rgb(232, 193, 160)"
              };
            }
            cat.implementations.forEach(impl => {
              if (impl.id === component.id) {
                validComponent = {
                  ...impl,
                  ...component,
                  color: "rgb(232, 193, 160)"
                };
              }
            });
          });
        });

        if (validComponent) {
          categoryArray.push(validComponent);
        }
      });
      // Sort components before assigning to result
      result[category as keyof NetworkUpdate] = categoryArray.sort(sortComponents);
    });

    console.log('Final network update:', JSON.stringify(result, null, 2));
    console.log('=== Network Analysis End ===\n');
    return result;
  } catch (e) {
    console.error('Failed to analyze content:', e);
    // Fallback to pattern-only analysis
    return patternAnalysis(content);
  }
}

function patternAnalysis(content: string): NetworkUpdate {
  // Helper to check if text matches any implementation
  function matchesAnyImplementation(text: string, implementations: PatternImplementation[]): boolean {
    return implementations.some(impl => text.match(impl.match));
  }
  const result: NetworkUpdate = {
    ai_models: [],
    company_resources: [],
    llm_clients: []
  };

  // Sort function for components
  const sortComponents = (a: NetworkUpdateComponent, b: NetworkUpdateComponent) => {
    // First sort by height (descending)
    if (b.height !== a.height) return b.height - a.height;
    // Then by size (descending)
    if (b.size !== a.size) return b.size - a.size;
    // Finally by id (ascending) for consistent ordering
    return a.id.localeCompare(b.id);
  };

  console.log('=== Pattern Analysis Debug ===');
  Object.entries(PATTERNS).forEach(([categoryKey, categoryData]) => {
    categoryData.categories.forEach(category => {
      const matchesPattern = category.patterns.some(pattern => content.match(pattern));
      const hasSpecificMatch = matchesAnyImplementation(content, category.implementations);
      
      if (matchesPattern) {
        console.log(`Category match: ${category.id}`);
        console.log('Metadata:', JSON.stringify(category, null, 2));
        
        const categoryArray = result[categoryKey as keyof NetworkUpdate] || [];
        // Only add the category if there are no specific implementation matches
        if (!hasSpecificMatch && !categoryArray.some(existing => existing.id === category.id)) {
          // Copy all metadata fields from the category pattern
          const component = {
            ...category,
            color: "rgb(232, 193, 160)"
          };
          categoryArray.push(component);
        }
        category.implementations.forEach(impl => {
          if (content.match(impl.match) && !categoryArray.some(existing => existing.id === impl.id)) {
            console.log(`Implementation match: ${impl.id}`);
            console.log('Implementation metadata:', JSON.stringify(impl, null, 2));
            // Copy all metadata fields from the implementation pattern
            const component = {
              ...impl,
              color: "rgb(232, 193, 160)"
            };
            categoryArray.push(component);
          }
        });
        // Sort components before assigning to result
        result[categoryKey as keyof NetworkUpdate] = categoryArray.sort(sortComponents);
      }
    });
  });

  return result;
}