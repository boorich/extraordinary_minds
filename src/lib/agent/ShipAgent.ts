// (Previous import statements remain the same)

export class ShipAgent implements AgentType {
  // (Previous code remains the same)

  public selectModel(): string {
    // Context-aware model selection strategy
    
    // For critical or final interactions, prioritize top-tier Anthropic model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-v2.1"; // Most advanced Anthropic model with 200K context
    }
    
    // Analyze conversation metrics to determine model suitability
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    // Philosophical and complex reasoning scenarios
    if (philosophical > technical && philosophical > creative) {
      return "anthropic/claude-v2.1"; // Anthropic excels in nuanced reasoning
    }
    
    // Technical and analytical deep dives
    if (technical > 0.7 * Math.max(philosophical, creative, analytical)) {
      return "openai/gpt-4"; // GPT-4 for complex technical analysis
    }
    
    // Creative and open-ended exploration
    if (creative > 0.6 * Math.max(technical, philosophical, analytical)) {
      return "anthropic/claude-v2.0"; // Claude's creative capabilities
    }
    
    // For standard conversational flow
    if (this.insightCount < 5) {
      // Alternate between top models to leverage strengths
      return this.insightCount % 2 === 0 
        ? "anthropic/claude-v2.0"  // Flagship Anthropic model
        : "openai/gpt-3.5-turbo-16k"; // Efficient OpenAI model
    }
    
    // For lighter, rapid interactions
    return this.insightCount % 2 === 0
      ? "anthropic/claude-instant-v1.1" // Anthropic's lightweight model
      : "openai/gpt-3.5-turbo"; // OpenAI's fastest model
  }

  // (Rest of the implementation remains the same)
}