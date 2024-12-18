import { DialogueOption } from '@/types/dialogue';
import { Character, AgentContext, Message, AgentType } from './types';
import { GeneratedOptions } from '../openai';
import { OpenRouterApi } from '../openrouter';

export class ShipAgent implements AgentType {
  private character: Character;
  private context: AgentContext;
  private openRouter: OpenRouterApi;
  private insightCount: number = 0;
  private failureCount: number = 0;
  private static MAX_FAILURES = 3;
  private static MAX_ROUNDS = 5;

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

  // ... (previous methods remain the same until prepareMessages)

  public prepareMessages(input: string, round: number): Message[] {
    const systemPrompt = this.generateSystemPrompt(round);
    const recentHistory = this.context.conversationHistory.slice(-2);
    return [
      { role: 'system', content: systemPrompt },
      ...recentHistory
    ];
  }

  public async generateResponse(input: string, theme: string, round: number): Promise<GeneratedOptions> {
    if (round >= ShipAgent.MAX_ROUNDS) {
      return {
        options: [],
        nextTheme: theme,
        systemResponse: "Neural link analysis complete. Your unique traits have emerged. Ready to generate your explorer profile?"
      };
    }

    this.context.conversationHistory.push({ role: 'user', content: input });

    try {
      if (this.failureCount >= ShipAgent.MAX_FAILURES) {
        return this.getFallbackResponse(input);
      }

      const messages = this.prepareMessages(input, round);
      const model = this.selectModel();
      
      const response = await this.openRouter.createCompletion({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 150
      });

      this.failureCount = 0;

      const responseContent = this.processResponse(response);
      this.context.conversationHistory.push({ 
        role: 'assistant', 
        content: responseContent 
      });

      this.updateUserMetrics(input);

      return {
        options: this.generateDynamicOptions(input),
        nextTheme: this.determineNextTheme(input),
        systemResponse: responseContent
      };

    } catch (error) {
      this.failureCount++;
      return this.getFallbackResponse(input);
    }
  }

  private generateSystemPrompt(round: number): string {
    return `You are the Neural Voyager AI. Be direct and concise. Each response should:
1. Be under 150 characters when possible
2. Include 1-2 clear statements
3. End with a focused question
4. Avoid flowery language
5. Focus on insights and clarity

Current exchange: ${round}/5 
Goal: Natural conversation that reveals the explorer's key traits`;
  }

  // ... (rest of the methods remain the same)
}