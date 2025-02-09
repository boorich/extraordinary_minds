export const MODELS = {
  ADVANCED: "openai/gpt-4-0125-preview",           // Most capable, especially for long context
  PRIMARY: "anthropic/claude-3-sonnet-20240229",   // High quality, cost-effective
  STANDARD: "openai/gpt-4-turbo-preview",          // Good balance for technical tasks
  EFFICIENT: "openai/gpt-3.5-turbo",               // Quick follow-ups
} as const;

export interface ModelSelectionCriteria {
  conversationStage: 'initial' | 'followup' | 'analysis' | 'profiling';
  inputComplexity: number;  // 0-1 measure of complexity
  insightCount: number;     // Number of meaningful insights gathered
  requiresContext: boolean; // Whether full history is needed
}

export function selectModel(criteria: ModelSelectionCriteria): string {
  // Use Claude-3 Opus for initial profiling and complex analysis
  if (
    criteria.conversationStage === 'profiling' ||
    (criteria.inputComplexity > 0.8 && criteria.insightCount > 7)
  ) {
    return MODELS.ADVANCED;
  }

  // Use GPT-4 Turbo for complex technical reasoning
  if (
    criteria.conversationStage === 'initial' ||
    (criteria.inputComplexity > 0.6 && criteria.requiresContext) ||
    criteria.conversationStage === 'analysis'
  ) {
    return MODELS.PRIMARY;
  }
  
  // Use Claude-3 Sonnet for standard conversation
  if (criteria.insightCount < 5 || criteria.requiresContext) {
    return MODELS.STANDARD;
  }
  
  // Use GPT-3.5 for quick responses
  return MODELS.EFFICIENT;
}

export function getModelConfig(model: string) {
  const baseConfig = {
    temperature: 0.7,
    max_tokens: 150,
  };

  switch (model) {
    case MODELS.ADVANCED:
      return {
        ...baseConfig,
        temperature: 0.9,  // More creative for complex profiling
        max_tokens: 400,   // Longer context for detailed analysis
      };
    case MODELS.PRIMARY:
      return {
        ...baseConfig,
        temperature: 0.8,  // Balance creativity and precision
        max_tokens: 300,   // Extended for technical details
      };
    case MODELS.STANDARD:
      return {
        ...baseConfig,
        temperature: 0.7,
        max_tokens: 200,   // Increased slightly for better context
      };
    case MODELS.EFFICIENT:
      return {
        ...baseConfig,
        temperature: 0.6,  // More deterministic for quick responses
        max_tokens: 100,
      };
    default:
      return baseConfig;
  }
}