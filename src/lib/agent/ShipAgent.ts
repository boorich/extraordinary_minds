// (Previous import statements remain the same)

export class ShipAgent implements AgentType {
  // (Previous code remains the same)

  public selectModel(): string {
    // For first interaction or final synthesis, use more powerful model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-3-opus-20240229";  // Updated to a current Claude 3 model
    }
    
    // For regular conversation, use standard model
    if (this.insightCount < 5) {
      return "openai/gpt-3.5-turbo";  // Keeping this as a fallback
    }
    
    // For simple follow-ups, use an efficient model
    return "anthropic/claude-3-haiku-20240307";  // Updated to current Haiku model
  }

  // (Rest of the implementation remains the same)
}