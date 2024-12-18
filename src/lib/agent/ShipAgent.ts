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

  public getProfileGenerationPrompt(): string {
    const traits = Object.entries(this.context.userMetrics)
      .sort(([,a], [,b]) => b - a);
    
    const dominantTrait = traits[0][0];
    const conversationHighlights = this.context.conversationHistory
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(-3);

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

  public generateExplorerName(): string {
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    const prefixes = {
      technical: ['Quantum', 'Cyber', 'Neural', 'Binary', 'Data'],
      philosophical: ['Echo', 'Void', 'Nova', 'Nebula', 'Cosmos'],
      creative: ['Aurora', 'Spark', 'Flux', 'Wave', 'Pulse'],
      analytical: ['Vector', 'Matrix', 'Node', 'Core', 'Arc']
    };
    
    const suffixes = ['Walker', 'Weaver', 'Seeker', 'Runner', 'Diver'];
    
    const traits = [
      { name: 'technical', value: technical },
      { name: 'philosophical', value: philosophical },
      { name: 'creative', value: creative },
      { name: 'analytical', value: analytical }
    ].sort((a, b) => b.value - a.value);
    
    const dominantTrait = traits[0].name as keyof typeof prefixes;
    const prefix = prefixes[dominantTrait][Math.floor(Math.random() * prefixes[dominantTrait].length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix}${suffix}`;
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

  public selectModel(): string {
    if (this.context.conversationHistory.length === 0) {
      return "anthropic/claude-3-haiku-20240307";
    }
    
    const { technical, philosophical } = this.context.userMetrics;
    
    return technical > philosophical
      ? "anthropic/claude-3-haiku-20240307"
      : "anthropic/claude-3-sonnet-20240229";
  }

  public processResponse(response: any): string {
    const content = response.choices[0].message.content.trim();
    const sentences: string[] = content.split(/[.!?]+/).filter((s: string) => s.trim());
    let processedContent = '';
    
    if (sentences.length > 0) {
      const mainContent = sentences.slice(0, 2).join('. ').trim();
      const question = sentences.find((s: string) => s.trim().endsWith('?'))?.trim() || 
                      "what draws your attention here?";
                      
      processedContent = `${mainContent}. ${question}`;
    } else {
      processedContent = content + " what are your thoughts on this?";
    }
    
    return processedContent.length > 150 ? processedContent.slice(0, 150) + "... what do you think?" : processedContent;
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

  private updateUserMetrics(input: string): void {
    const patterns = {
      technical: /\b(how|works|system|code|data|process|technical)\b/i,
      philosophical: /\b(why|meaning|purpose|think|believe|consciousness)\b/i,
      creative: /\b(imagine|create|design|vision|art|future|possible)\b/i,
      analytical: /\b(analyze|pattern|structure|logic|reason|understand)\b/i
    };

    for (const [trait, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) {
        this.context.userMetrics[trait as keyof typeof this.context.userMetrics] += 1;
      }
    }
  }

  private getFallbackResponse(input: string): GeneratedOptions {
    const fallbackResponses = [
      "interesting perspective. what made you think of that?",
      "that's a unique way to look at it. can you elaborate?",
      "i see a pattern forming. what's your next thought?",
      "that connects to something deeper. where does it lead you?",
      "your path is becoming clear. what else do you see?"
    ];

    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    };
  }
}