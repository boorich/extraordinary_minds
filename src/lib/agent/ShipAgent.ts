// (Previous import statements remain the same)

export class ShipAgent implements AgentType {
  // (Previous code remains the same)

  public selectModel(): string {
    // For first interaction or final synthesis, use more powerful model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "openai/gpt-4"; // Most advanced model for critical interactions
    }
    
    // For regular conversation, use standard model
    if (this.insightCount < 5) {
      return "openai/gpt-3.5-turbo-16k"; // High context, efficient model
    }
    
    // For simple follow-ups, use a standard model
    return "openai/gpt-3.5-turbo"; // Fastest, standard model
  }

  // (Rest of the implementation remains the same)
}