import { DialogueOption } from '@/types/dialogue';
import { AgentConfig, AgentContext, AgentResponse } from './types';
import { GeneratedOptions } from '../openai';

export class ShipAgent {
  private config: AgentConfig;
  private context: AgentContext;

  constructor(config: AgentConfig) {
    this.config = config;
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
  }

  async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    // Determine if we need to escalate to a more powerful model
    const model = this.shouldEscalateModel() 
      ? this.config.settings.escalationModel 
      : this.config.settings.defaultModel;

    // Update context
    this.context.conversationHistory.push({ role: 'user', content: input });
    this.context.currentTheme = theme;

    try {
      const response = await this.callLanguageModel(model, {
        messages: this.prepareMessages(),
        temperature: 0.7,
        max_tokens: 150
      });

      const options = this.processResponse(response);
      
      return {
        options: options.slice(0, 4),
        nextTheme: this.determineNextTheme(input, options),
        systemResponse: this.generateSystemResponse(options)
      };
    } catch (error) {
      // Fallback to simpler model if needed
      if (model !== this.config.settings.fallbackModel) {
        return this.fallbackResponse(input);
      }
      throw error;
    }
  }

  private shouldEscalateModel(): boolean {
    return this.config.settings.escalationTriggers.some(trigger => 
      this.context.conversationHistory.some(msg => 
        msg.content.toLowerCase().includes(trigger)
      )
    );
  }

  private prepareMessages() {
    return [
      {
        role: 'system',
        content: this.generateSystemPrompt()
      },
      ...this.context.conversationHistory.slice(-5)
    ];
  }

  private generateSystemPrompt(): string {
    return `${this.config.system}
Current theme: ${this.context.currentTheme}
Style rules:
${this.config.style.all.join('\n')}

Relevant examples:
${this.getRelevantExamples()}`;
  }

  private getRelevantExamples(): string {
    const examples = this.config.messageExamples
      .filter(ex => ex.type === this.context.currentTheme)
      .map(ex => ex.examples)
      .flat()
      .slice(0, 3)
      .map(ex => `Input: ${ex.input}\nResponse: ${ex.response}`)
      .join('\n\n');

    return examples || 'No specific examples available for this theme.';
  }

  private async callLanguageModel(model: string, params: any) {
    const response = await fetch('/api/agent/completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, ...params })
    });
    
    if (!response.ok) {
      throw new Error('Language model call failed');
    }
    
    return response.json();
  }

  private processResponse(response: any): DialogueOption[] {
    try {
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      return parsedResponse.options.map((opt: any) => ({
        text: opt.text,
        type: opt.type,
        score: 1
      }));
    } catch (error) {
      console.error('Error processing response:', error);
      return this.getFallbackOptions();
    }
  }

  private getFallbackOptions(): DialogueOption[] {
    return this.config.messageExamples[0].examples.map(ex => ({
      text: ex.response,
      type: 'technical',
      score: 1
    }));
  }

  private determineNextTheme(input: string, options: DialogueOption[]): string {
    // Simple theme progression based on user metrics
    const metrics = this.context.userMetrics;
    const maxMetric = Object.entries(metrics).reduce((a, b) => 
      metrics[a] > metrics[b[0]] ? a : b[0]
    );
    
    return maxMetric;
  }

  private generateSystemResponse(options: DialogueOption[]): string {
    return "The ship's AI processes your input through quantum matrices...";
  }

  private async fallbackResponse(input: string): Promise<GeneratedOptions> {
    return {
      options: this.getFallbackOptions(),
      nextTheme: 'fallback',
      systemResponse: 'The neural winds are unfavorable. Let\'s navigate these waters carefully.'
    };
  }
}