// Add more verbose logging to understand response generation
public async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
  console.log('Input received:', input);
  console.log('Current context:', this.context);

  this.context.conversationHistory.push({ role: 'user', content: input });

  try {
    if (this.failureCount >= ShipAgent.MAX_FAILURES) {
      console.log('Using fallback due to max failures');
      return this.getFallbackResponse(input);
    }

    const messages = this.prepareMessages(input);
    const model = this.selectModel();

    console.log('Preparing API call:', { 
      model, 
      messageCount: messages.length,
      messages: messages.map(m => `${m.role}: ${m.content.slice(0, 100)}`)
    });
    
    const response = await this.openRouter.createCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 150
    });

    console.log('Raw API response:', response);

    this.failureCount = 0;

    const responseContent = this.processResponse(response);
    console.log('Processed response:', responseContent);

    this.context.conversationHistory.push({ 
      role: 'assistant', 
      content: responseContent 
    });

    if (this.isInsightful(responseContent)) {
      this.insightCount++;
      console.log('Insight count increased to:', this.insightCount);
    }

    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: responseContent
    };

  } catch (error) {
    console.error('Detailed response generation error:', error);
    this.failureCount++;
    return this.getFallbackResponse(input);
  }
}