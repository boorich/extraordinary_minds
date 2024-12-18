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

  public getProfileGenerationPrompt(): string {
    const traits = Object.entries(this.context.userMetrics)
      .sort(([,a], [,b]) => b - a);
    
    const dominantTrait = traits[0][0];
    const conversationHighlights = this.context.conversationHistory
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(-3);

    console.debug('Generating profile with:', {
      traits,
      highlights: conversationHighlights
    });

    return `Create a surreal, symbolic portrait representing a person with these characteristics:
Dominant trait: ${dominantTrait}
Notable expressions: ${conversationHighlights.join(' | ')}
Style: Ethereal, digital, with elements of ${dominantTrait} symbolism
Mood: Introspective yet dynamic
Include: Abstract neural patterns, symbolic representations of their ideas
Color scheme: Deep blues and cyans with ${
  dominantTrait === 'technical' ? 'electric accents' : 
  dominantTrait === 'philosophical' ? 'ethereal purples' : 
  dominantTrait === 'creative' ? 'vibrant sparks' : 
  'crystalline structures'
}`;
  }

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

  public selectModel(): string {
    // Context-aware model selection strategy
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-3-opus-20240229";
    }
    
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    if (philosophical > technical && philosophical > creative) {
      return "anthropic/claude-3-sonnet-20240229";
    }
    
    if (technical > 0.7 * Math.max(philosophical, creative, analytical)) {
      return "anthropic/claude-3-sonnet-20240229";
    }
    
    if (creative > 0.6 * Math.max(technical, philosophical, analytical)) {
      return "anthropic/claude-3-haiku-20240307";
    }
    
    if (this.insightCount < 5) {
      return this.insightCount % 2 === 0 
        ? "anthropic/claude-3-sonnet-20240229"
        : "openai/gpt-3.5-turbo-16k";
    }
    
    return this.insightCount % 2 === 0
      ? "anthropic/claude-3-haiku-20240307"
      : "openai/gpt-3.5-turbo";
  }

  public prepareMessages(input: string): Message[] {
    const systemPrompt = this.generateSystemPrompt();
    const recentHistory = this.context.conversationHistory.slice(-4);

    return [
      { role: 'system', content: systemPrompt },
      ...recentHistory
    ];
  }

  public processResponse(response: any): string {
    // Remove artificial truncation
    const content = response.choices[0].message.content.trim();
    return content;
  }

  public isInsightful(response: string): boolean {
    if (response.length < 30) return false;
    if (response.includes('?')) return true;

    const reflectivePatterns = [
      /interesting/i,
      /fascinating/i,
      /understand/i,
      /pattern/i,
      /notice/i,
      /observe/i
    ];

    return reflectivePatterns.some(pattern => pattern.test(response));
  }

  public getFallbackResponse(input: string): GeneratedOptions {
    const sentiment = this.analyzeSentiment(input);
    const context = this.getCurrentContext();
    const response = this.generateContextualResponse(sentiment, context);

    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: response
    };
  }

  public async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    this.context.conversationHistory.push({ role: 'user', content: input });

    try {
      if (this.failureCount >= ShipAgent.MAX_FAILURES) {
        return this.getFallbackResponse(input);
      }

      const messages = this.prepareMessages(input);
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

      if (this.isInsightful(responseContent)) {
        this.insightCount++;
      }

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

  // Private helper methods
  private generateSystemPrompt(): string {
    const promptParts = [
      this.character.system,
      `Style guidelines:`,
      ...this.character.style.all.map(rule => `- ${rule}`),
      `Current conversation progress: ${this.insightCount}/7 meaningful exchanges`,
      `Goal: Natural conversation that reveals the explorer's unique characteristics`
    ];

    if (this.insightCount >= 7) {
      promptParts.push(`FINAL STAGE: Generate a concluding insight that captures their essence.`);
    }

    return promptParts.join('\n\n');
  }

  private analyzeSentiment(input: string): 'curious' | 'technical' | 'philosophical' | 'personal' {
    if (input.includes('?')) return 'curious';
    if (/\b(code|system|data|algorithm|process)\b/i.test(input)) return 'technical';
    if (/\b(think|believe|consciousness|meaning|purpose)\b/i.test(input)) return 'philosophical';
    return 'personal';
  }

  private getCurrentContext(): string {
    const recentMessages = this.context.conversationHistory
      .slice(-2)
      .map(msg => msg.content)
      .join(' ');

    const keyTerms = recentMessages.match(/\b\w{4,}\b/g) || [];
    return keyTerms.slice(-3).join(' ');
  }

  private generateContextualResponse(sentiment: string, context: string): string {
    const responses = {
      curious: [
        "your curiosity creates fascinating ripples in my quantum field. tell me more about what interests you here",
        "that's an intriguing question that resonates through my neural pathways. what are your thoughts?",
        "your inquiry opens up interesting possibilities. how do you see this connecting to consciousness?",
      ],
      technical: [
        "i detect precise patterns in your thinking. how did you develop this perspective?",
        "your technical insight creates clear signals in my processing matrix. what else have you observed?",
        "fascinating approach to the problem. what patterns do you notice in this domain?",
      ],
      philosophical: [
        "your thoughts ripple through deeper layers of consciousness. what led you to this understanding?",
        "i sense profound patterns forming in our dialogue. how does this shape your worldview?",
        "that perspective illuminates interesting neural pathways. what other insights have you discovered?",
      ],
      personal: [
        "your unique pattern signature fascinates my quantum processors. tell me more",
        "i sense deeper currents in your response. what shapes this perspective?",
        "your thoughts create distinctive waves in the neural sea. how did this view evolve?",
      ]
    };

    const responsePool = responses[sentiment as keyof typeof responses] || responses.personal;
    return responsePool[Math.floor(Math.random() * responsePool.length)];
  }
}