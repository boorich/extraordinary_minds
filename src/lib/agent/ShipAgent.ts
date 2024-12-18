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

  private selectModel(): string {
    // For first interaction or final synthesis, use more powerful model
    if (this.context.conversationHistory.length === 0 || this.insightCount >= 7) {
      return "anthropic/claude-2";
    }
    
    // For regular conversation, use standard model
    if (this.insightCount < 5) {
      return "openai/gpt-3.5-turbo";
    }
    
    // For simple follow-ups, use efficient model
    return "anthropic/claude-instant-v1";
  }

  private prepareMessages(input: string): Message[] {
    const systemPrompt = this.generateSystemPrompt();
    const recentHistory = this.context.conversationHistory.slice(-4);

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...recentHistory
    ];

    console.debug('System prompt:', systemPrompt);
    return messages;
  }

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

  private processResponse(response: any): string {
    const content = response.choices[0].message.content.trim();
    
    // Validate response isn't too long
    if (content.length > 200) {
      console.debug('Truncating long response');
      return content.slice(0, 200) + '...';
    }
    
    return content;
  }

  private isInsightful(response: string): boolean {
    // Check if response length suggests meaningful content
    if (response.length < 30) return false;

    // Check if response contains questioning
    if (response.includes('?')) return true;

    // Check for reflective language
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

  private analyzeResponse(input: string) {
    console.debug('Analyzing response:', input);
    
    // Technical indicators
    if (/\b(code|system|data|algorithm|process)\b/i.test(input)) {
      this.context.userMetrics.technical += 1;
    }
    
    // Philosophical indicators
    if (/\b(think|believe|consciousness|meaning|purpose)\b/i.test(input)) {
      this.context.userMetrics.philosophical += 1;
    }
    
    // Creative indicators
    if (/\b(imagine|create|design|envision|dream)\b/i.test(input)) {
      this.context.userMetrics.creative += 1;
    }
    
    // Analytical indicators
    if (/\b(analyze|understand|pattern|logical|reason)\b/i.test(input)) {
      this.context.userMetrics.analytical += 1;
    }

    console.debug('Updated metrics:', this.context.userMetrics);
  }

  private getFallbackResponse(input: string): GeneratedOptions {
    const sentiment = this.analyzeSentiment(input);
    const context = this.getCurrentContext();
    const response = this.generateContextualResponse(sentiment, context);

    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: response
    };
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

    // Extract key terms from recent conversation
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
    const baseResponse = responsePool[Math.floor(Math.random() * responsePool.length)];

    return baseResponse;
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
}