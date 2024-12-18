// (Previous import statements remain the same)

export class ShipAgent implements AgentType {
  // (Previous code remains the same)

  public selectModel(): string {
    // For first interaction or final synthesis, use more powerful model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-v2.1"; // Most advanced model with 200K context
    }
    
    // For regular conversation, use standard model
    if (this.insightCount < 5) {
      return "anthropic/claude-v2.0"; // Flagship model with strong reasoning capabilities
    }
    
    // For simple follow-ups, use a lighter model
    return "anthropic/claude-instant-v1.1"; // Low-latency, high throughput model
  }

  // (Rest of the implementation remains the same)
}