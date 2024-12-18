export const MODELS = {
  PRIMARY: "anthropic/claude-2",           // Complex reasoning & profiling
  STANDARD: "openai/gpt-3.5-turbo",        // General conversation
  EFFICIENT: "anthropic/claude-instant-v1", // Quick follow-ups
} as const;

export interface ModelSelectionCriteria {
  conversationStage: 'initial' | 'followup' | 'analysis' | 'profiling';
  inputComplexity: number;  // 0-1 measure of complexity
  insightCount: number;     // Number of meaningful insights gathered
  requiresContext: boolean; // Whether full history is needed
}

export function selectModel(criteria: ModelSelectionCriteria): string {
  // Use Claude-2 for complex tasks
  if (
    criteria.conversationStage === 'initial' || 
    criteria.conversationStage === 'profiling' ||
    (criteria.inputComplexity > 0.7 && criteria.requiresContext)
  ) {
    return MODELS.PRIMARY;
  }
  
  // Use GPT-3.5 for standard conversation
  if (criteria.insightCount < 5 || criteria.requiresContext) {
    return MODELS.STANDARD;
  }
  
  // Use Claude Instant for quick responses
  return MODELS.EFFICIENT;
}

export function getModelConfig(model: string) {
  const baseConfig = {
    temperature: 0.7,
    max_tokens: 150,
  };

  switch (model) {
    case MODELS.PRIMARY:
      return {
        ...baseConfig,
        temperature: 0.8,
        max_tokens: 250,
      };
    case MODELS.STANDARD:
      return {
        ...baseConfig,
        temperature: 0.7,
        max_tokens: 150,
      };
    case MODELS.EFFICIENT:
      return {
        ...baseConfig,
        temperature: 0.6,
        max_tokens: 100,
      };
    default:
      return baseConfig;
  }
}