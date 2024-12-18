import { DialogueOption } from '@/types/dialogue';
import { Character, AgentContext, Message } from './types';
import { GeneratedOptions } from '../openai';
import { OpenRouterApi } from '../openrouter';

export class ShipAgent {
  private character: Character;
  private context: AgentContext;
  private openRouter: OpenRouterApi;
  private insightCount: number = 0;
  private failureCount: number = 0;
  private static MAX_FAILURES = 3;

  constructor(character: Character) {
    this.character = character;
    this.context = {
      currentTheme: 'initial_contact',
      conversationHistory: [],
      userMetrics: {
        technical: 0,
        philosophical: 0,
        creative: 0,
        analytical: 0
      }
    };
    this.openRouter = new OpenRouterApi('');
  }

  async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    console.debug('Generating response for:', { input, theme, insightCount: this.insightCount });

    // Add user input to history
    this.context.conversationHistory.push({ role: 'user', content: input });

    try {
      if (this.failureCount >= ShipAgent.MAX_FAILURES) {
        console.debug('Using fallback due to too many failures');
        return this.getFallbackResponse(input);
      }

      const messages = this.prepareMessages(input);
      const model = this.selectModel();

      console.debug('Attempting API call with:', { model, messageCount: messages.length });
      
      const response = await this.openRouter.createCompletion({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 150
      });

      // Reset failure count on success
      this.failureCount = 0;

      const responseContent = this.processResponse(response);
      this.context.conversationHistory.push({ 
        role: 'assistant', 
        content: responseContent 
      });

      if (this.isInsightful(responseContent)) {
        this.insightCount++;
        console.debug('Increased insight count to:', this.insightCount);
      }

      return {
        options: this.generateDynamicOptions(input),
        nextTheme: this.determineNextTheme(input),
        systemResponse: responseContent
      };

    } catch (error) {
      console.error('Response generation error:', error);
      this.failureCount++;
      console.debug('Increased failure count to:', this.failureCount);
      return this.getFallbackResponse(input);
    }
  }

  // ... rest of your previous methods ...

}