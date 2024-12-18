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

  // All previous methods would be reinserted here
  public generateDynamicOptions(input: string): DialogueOption[] {
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    const baseOptions: DialogueOption[] = [
      { 
        text: 'Continue Exploring', 
        type: 'analytical',
        score: 50,
        nextPrompt: 'continue' 
      }
    ];

    const options: DialogueOption[] = [];

    if (technical > philosophical && technical > creative) {
      options.push(
        { 
          text: 'Dive Deeper into Technical Details', 
          type: 'technical', 
          score: 75,
          nextPrompt: 'technical_deep_dive'
        }
      );
    }

    if (philosophical > technical && philosophical > analytical) {
      options.push(
        { 
          text: 'Explore Philosophical Implications', 
          type: 'philosophical', 
          score: 75,
          nextPrompt: 'philosophical_reflection'
        }
      );
    }

    if (creative > analytical && creative > technical) {
      options.push(
        { 
          text: 'Discuss Creative Perspectives', 
          type: 'creative', 
          score: 75,
          nextPrompt: 'creative_exploration'
        }
      );
    }

    if (analytical > creative && analytical > philosophical) {
      options.push(
        { 
          text: 'Analyze Systematic Approach', 
          type: 'analytical', 
          score: 75,
          nextPrompt: 'analytical_breakdown'
        }
      );
    }

    if (Math.random() < 0.3) {
      options.push(
        { 
          text: 'Unexpected Tangent', 
          type: 'creative',
          score: 50,
          nextPrompt: 'wild_card'
        }
      );
    }

    return options.length > 0 ? options : baseOptions;
  }

  public determineNextTheme(input: string): string {
    const currentTheme = this.context.currentTheme;
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;

    const themeProgression: {[key: string]: string} = {
      'initial_contact': 
        technical > philosophical ? 'technical_exploration' :
        philosophical > creative ? 'philosophical_inquiry' :
        creative > analytical ? 'creative_dialogue' : 
        'analytical_investigation',
      
      'technical_exploration': 
        philosophical > technical ? 'philosophical_reflection' :
        creative > technical ? 'creative_application' : 
        'deep_technical_analysis',
      
      'philosophical_inquiry': 
        technical > philosophical ? 'technical_implications' :
        creative > philosophical ? 'imaginative_philosophy' :
        'profound_contemplation',
      
      'creative_dialogue': 
        technical > creative ? 'technical_creativity' :
        philosophical > creative ? 'philosophical_imagination' :
        'pure_creative_flow',
      
      'analytical_investigation': 
        creative > analytical ? 'creative_analysis' :
        philosophical > analytical ? 'philosophical_reasoning' :
        'systematic_breakdown'
    };

    const nextTheme = themeProgression[currentTheme] || 'initial_contact';
    this.context.currentTheme = nextTheme;

    return nextTheme;
  }

  // (All other previous methods would be reinserted)
  public async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    console.debug('Generating response for:', { input, theme, insightCount: this.insightCount });

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

  // (Rest of the implementation would continue)
}