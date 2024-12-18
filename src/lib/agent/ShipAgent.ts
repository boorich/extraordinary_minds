// Keep existing import statements
export class ShipAgent implements AgentType {
  // (Previous implementation remains the same)

  public selectModel(): string {
    // Context-aware model selection strategy
    
    // For critical or final interactions, prioritize top-tier Anthropic model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-3-opus-20240229"; // Most advanced Anthropic model
    }
    
    // Analyze conversation metrics to determine model suitability
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    // Philosophical and complex reasoning scenarios
    if (philosophical > technical && philosophical > creative) {
      return "anthropic/claude-3-sonnet-20240229"; // Balanced, nuanced reasoning
    }
    
    // Technical and analytical deep dives
    if (technical > 0.7 * Math.max(philosophical, creative, analytical)) {
      return "anthropic/claude-3-sonnet-20240229"; // Solid technical capabilities
    }
    
    // Creative and open-ended exploration
    if (creative > 0.6 * Math.max(technical, philosophical, analytical)) {
      return "anthropic/claude-3-haiku-20240307"; // Lightweight, creative model
    }
    
    // For standard conversational flow
    if (this.insightCount < 5) {
      // Alternate between top models to leverage strengths
      return this.insightCount % 2 === 0 
        ? "anthropic/claude-3-sonnet-20240229"  // Flagship Anthropic model
        : "openai/gpt-3.5-turbo-16k"; // Efficient OpenAI model
    }
    
    // For lighter, rapid interactions
    return this.insightCount % 2 === 0
      ? "anthropic/claude-3-haiku-20240307" // Anthropic's lightweight model
      : "openai/gpt-3.5-turbo"; // OpenAI's fastest model
  }

  // (Rest of the implementation remains the same)
}