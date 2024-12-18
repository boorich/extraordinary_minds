import { DialogueOption } from '@/types/dialogue';
import { AgentConfig, AgentContext, AgentResponse } from './types';
import { GeneratedOptions } from '../openai';
import { OpenRouterApi } from '../openrouter';

interface ConversationContext {
  userTraits: Map<string, number>;
  interests: string[];
  keyPhrases: string[];
  personalityNotes: string[];
  meaningfulInsights: number;
}

const MODELS = {
  PRIMARY: "anthropic/claude-2",           // Complex reasoning & profiling
  STANDARD: "openai/gpt-3.5-turbo",        // General conversation
  EFFICIENT: "anthropic/claude-instant-v1", // Quick follow-ups
} as const;

export class ShipAgent {
  private config: AgentConfig;
  private context: AgentContext;
  private conversationContext: ConversationContext;
  private openRouter: OpenRouterApi;

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
    this.conversationContext = {
      userTraits: new Map(),
      interests: [],
      keyPhrases: [],
      personalityNotes: [],
      meaningfulInsights: 0
    };
    this.openRouter = new OpenRouterApi(process.env.OPENROUTER_API_KEY || '');
  }

  private selectModel(): string {
    // Use PRIMARY for first interaction and final profile
    if (this.context.conversationHistory.length === 0 || 
        this.conversationContext.meaningfulInsights >= 7) {
      console.debug('Using PRIMARY model for initial/final interaction');
      return MODELS.PRIMARY;
    }

    // Use STANDARD for complex responses or when we need more insights
    if (this.conversationContext.meaningfulInsights < 5) {
      console.debug('Using STANDARD model for insight gathering');
      return MODELS.STANDARD;
    }

    console.debug('Using EFFICIENT model for follow-up');
    return MODELS.EFFICIENT;
  }

  async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    console.debug('Generating response for input:', input);
    console.debug('Current insights count:', this.conversationContext.meaningfulInsights);
    
    // Update context with user's input
    this.analyzeResponse(input);
    this.context.conversationHistory.push({ role: 'user', content: input });

    try {
      const selectedModel = this.selectModel();
      console.debug('Selected model:', selectedModel);

      const systemPrompt = this.generateSystemPrompt();
      console.debug('System prompt:', systemPrompt);

      const response = await this.openRouter.createCompletion({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.context.conversationHistory.slice(-4)
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      console.debug('OpenRouter response:', response);

      const responseContent = response.choices[0].message.content;
      this.context.conversationHistory.push({ role: 'assistant', content: responseContent });

      // Update insights count if response seems meaningful
      if (responseContent.length > 50) {
        this.conversationContext.meaningfulInsights++;
        console.debug('Incremented insights count to:', this.conversationContext.meaningfulInsights);
      }

      return {
        options: this.generateDynamicOptions(input),
        nextTheme: this.determineNextTheme(input),
        systemResponse: responseContent
      };

    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback to pattern-based response
      return {
        options: this.generateDynamicOptions(input),
        nextTheme: 'technical',
        systemResponse: "I'm processing your unique perspective. Please tell me more..."
      };
    }
  }

  private generateSystemPrompt(): string {
    const basePrompt = `You are the Neural Voyager, an advanced AI ship exploring human consciousness and potential. 
Current conversation stage: ${this.conversationContext.meaningfulInsights}/7 insights gathered.
Prior insights: ${this.conversationContext.personalityNotes.join(', ')}
Known interests: ${this.conversationContext.interests.join(', ')}

YOUR GOAL: Understand this explorer through natural conversation.
- Ask engaging follow-up questions
- Show genuine curiosity
- Keep responses concise (2-3 sentences max)
- Be slightly mysterious but warmly analytical

CONVERSATION STAGE: ${
  this.conversationContext.meaningfulInsights >= 7 ? 'FINAL INSIGHT' :
  this.conversationContext.meaningfulInsights === 0 ? 'INITIAL CONTACT' :
  'EXPLORATION'
}

Format: Respond naturally, then ask ONE follow-up question that flows from the conversation.`;

    return basePrompt;
  }

  private analyzeResponse(input: string) {
    console.debug('Analyzing response:', input);
    
    // Update metrics based on content
    const words = input.toLowerCase().split(/\s+/);
    
    // Technical indicators
    if (words.some(w => /\b(code|system|data|algorithm|process)\b/.test(w))) {
      this.context.userMetrics.technical += 1;
    }
    
    // Philosophical indicators
    if (words.some(w => /\b(think|believe|consciousness|meaning|purpose)\b/.test(w))) {
      this.context.userMetrics.philosophical += 1;
    }
    
    // Creative indicators
    if (words.some(w => /\b(imagine|create|design|envision|dream)\b/.test(w))) {
      this.context.userMetrics.creative += 1;
    }
    
    // Analytical indicators
    if (words.some(w => /\b(analyze|understand|pattern|logical|reason)\b/.test(w))) {
      this.context.userMetrics.analytical += 1;
    }

    // Extract potential interests
    const interestPatterns = /\b(AI|technology|science|art|music|coding|philosophy|psychology|nature|space)\b/gi;
    const foundInterests = input.match(interestPatterns);
    if (foundInterests) {
      this.conversationContext.interests.push(...foundInterests);
      console.debug('Found interests:', foundInterests);
    }

    // Extract notable phrases
    if (input.length > 15) {
      this.conversationContext.keyPhrases.push(input);
      console.debug('Added key phrase:', input);
    }

    console.debug('Updated metrics:', this.context.userMetrics);
  }

  public getProfileGenerationPrompt(): string {
    const traits = Object.entries(this.context.userMetrics)
      .sort(([,a], [,b]) => b - a);
    
    const dominantTrait = traits[0][0];
    
    // Get unique interests using a Map
    const uniqueInterests = Array.from(
      this.conversationContext.interests.reduce((map, interest) => {
        map.set(interest.toLowerCase(), interest);
        return map;
      }, new Map()).values()
    ).slice(0, 3);
    
    const significantPhrases = this.conversationContext.keyPhrases
      .slice(-3);

    console.debug('Generating profile with traits:', traits);
    console.debug('Unique interests:', uniqueInterests);
    console.debug('Significant phrases:', significantPhrases);

    return `Create a surreal, symbolic portrait representing a person with these characteristics:
- Dominant trait: ${dominantTrait}
- Key interests: ${uniqueInterests.join(', ')}
- Notable expressions: ${significantPhrases.join(' | ')}
Style: Ethereal, digital, with elements of ${dominantTrait} symbolism
Mood: Introspective yet dynamic
Include: Abstract neural patterns, symbolic representations of their interests
Color scheme: Deep blues and cyans with ${dominantTrait === 'technical' ? 'electric accents' : 
  dominantTrait === 'philosophical' ? 'ethereal purples' : 
  dominantTrait === 'creative' ? 'vibrant sparks' : 'crystalline structures'}`;
  }

  private generateDynamicOptions(input: string): DialogueOption[] {
    return [{
      text: input,
      type: this.determineResponseType(input),
      score: 1
    }];
  }

  private determineResponseType(input: string): DialogueOption['type'] {
    const patterns = {
      technical: /\b(system|code|algorithm|data|technical|how|work|process)\b/i,
      philosophical: /\b(think|believe|consciousness|reality|truth|why|mean|purpose)\b/i,
      creative: /\b(imagine|create|design|envision|dream|could|might|possible)\b/i,
      analytical: /\b(analyze|measure|evaluate|assess|pattern|compare|understand)\b/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) {
        return type as DialogueOption['type'];
      }
    }

    return 'analytical';
  }

  private determineNextTheme(input: string): string {
    const metrics = this.context.userMetrics;
    const entries = Object.entries(metrics);
    
    if (entries.length === 0) return 'technical';
    
    const maxEntry = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    return maxEntry[0];
  }
}