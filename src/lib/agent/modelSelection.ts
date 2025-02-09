export const MODELS = {
  ADVANCED: "anthropic/claude-3.5-sonnet-20240229", // Most intelligent model
  PRIMARY: "anthropic/claude-3-opus-20240229",      // Excels at writing and complex tasks
  STANDARD: "openai/gpt-4-turbo-preview",           // Good balance for technical tasks
  EFFICIENT: "openai/gpt-3.5-turbo",                // Quick follow-ups
} as const;

export interface ModelSelectionCriteria {
  conversationStage: 'initial' | 'followup' | 'analysis' | 'profiling';
  inputComplexity: number;  // 0-1 measure of complexity
  insightCount: number;     // Number of meaningful insights gathered
  requiresContext: boolean; // Whether full history is needed
}

export function selectModel(criteria: ModelSelectionCriteria): string {
  // Final synthesis (Round 5) - Using Opus for complex synthesis
  if (criteria.conversationStage === 'profiling') {
    return MODELS.PRIMARY;  // Claude-3 Opus
  }

  // High complexity messages need most capable model regardless of stage
  if (criteria.inputComplexity > 0.8) {
    return MODELS.ADVANCED;  // Claude 3.5 Sonnet
  }

  // Initial interaction (Round 1)
  if (criteria.conversationStage === 'initial') {
    return criteria.inputComplexity > 0.4
      ? MODELS.STANDARD    // GPT-4 Turbo for technical queries
      : MODELS.EFFICIENT;  // GPT-3.5 Turbo for simple queries
  }

  // Rounds 2-4: Progressive discovery needs context
  if (criteria.requiresContext) {
    return MODELS.STANDARD;  // GPT-4 Turbo for technical understanding
  }

  // Default to efficient model for simple follow-ups
  return MODELS.EFFICIENT;  // GPT-3.5 Turbo
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