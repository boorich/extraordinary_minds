import { NetworkUpdate, NetworkUpdateComponent } from './parser';
import { PATTERNS } from './patterns';
import { OpenRouterApi } from '../openrouter';

const openRouter = new OpenRouterApi('');

const EXTRACTION_PROMPT = `Analyze the following text and extract technical components in these categories:
1. LLM Clients: tools, interfaces, user touchpoints
2. AI Models: ML capabilities, language models, specialized AI
3. Company Resources: systems, data, APIs being integrated

For each component, specify:
- id: kebab-case identifier
- size (12-32): importance/centrality score
- height (0-2): hierarchy level (0: specific instance, 1: group, 2: category)

Return strictly in this format:
{
  "llm_clients": [{"id": "component-id", "size": 24, "height": 1}],
  "ai_models": [{"id": "component-id", "size": 24, "height": 1}],
  "company_resources": [{"id": "component-id", "size": 24, "height": 1}]
}`;

export async function analyzeContent(content: string): Promise<NetworkUpdate> {
  console.log('=== Network Analysis Start ===');
  
  try {
    // First pass: Extract components using LLM
    const completion = await openRouter.createCompletion({
      model: 'claude-3-haiku-20240307',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content }
      ],
      temperature: 0.2,
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

    // Process each category
    Object.entries(extractedComponents).forEach(([category, components]) => {
      const categoryArray = result[category as keyof NetworkUpdate] || [];
      (components as NetworkUpdateComponent[]).forEach(component => {
        // Validate component exists in patterns
        const isValid = Object.values(PATTERNS).some(categoryData =>
          categoryData.categories.some(cat =>
            cat.id === component.id || cat.implementations.some(impl => impl.id === component.id)
          )
        );

        if (isValid) {
          categoryArray.push({
            ...component,
            color: "rgb(232, 193, 160)"
          });
        }
      });
      result[category as keyof NetworkUpdate] = categoryArray;
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
  const result: NetworkUpdate = {
    ai_models: [],
    company_resources: [],
    llm_clients: []
  };

  Object.entries(PATTERNS).forEach(([categoryKey, categoryData]) => {
    categoryData.categories.forEach(category => {
      if (category.patterns.some(pattern => content.match(pattern))) {
        const categoryArray = result[categoryKey as keyof NetworkUpdate] || [];
        if (!categoryArray.some(existing => existing.id === category.id)) {
          categoryArray.push({
            id: category.id,
            size: category.size,
            height: category.height,
            color: "rgb(232, 193, 160)"
          });
        }
        category.implementations.forEach(impl => {
          if (content.match(impl.match) && !categoryArray.some(existing => existing.id === impl.id)) {
            categoryArray.push({
              id: impl.id,
              size: impl.size,
              height: impl.height,
              color: "rgb(232, 193, 160)"
            });
          }
        });
        result[categoryKey as keyof NetworkUpdate] = categoryArray;
      }
    });
  });

  return result;
}