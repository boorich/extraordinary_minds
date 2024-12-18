import { DialogueOption } from '@/types/dialogue';
import { Character, AgentContext, Message } from './types';
import { GeneratedOptions } from '../openai';
import { OpenRouterApi } from '../openrouter';

export class ShipAgent {
  private character: Character;
  private context: AgentContext;
  private openRouter: OpenRouterApi;
  private insightCount: number = 0;
  private lastResponseIndex: number = -1;

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
    this.openRouter = new OpenRouterApi(process.env.OPENROUTER_API_KEY || '');
  }

  async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    console.debug('Generating response for:', { input, theme, insightCount: this.insightCount });

    // Add user input to history
    this.context.conversationHistory.push({ role: 'user', content: input });

    try {
      // Prepare conversation for the model
      const messages = this.prepareMessages(input);
      console.debug('Prepared messages:', messages);

      // Select appropriate model based on conversation stage
      const model = this.selectModel();
      console.debug('Selected model:', model);

      // Generate response
      const response = await this.openRouter.createCompletion({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 150
      });

      console.debug('OpenRouter response:', response);

      // Process the response
      const responseContent = this.processResponse(response);
      this.context.conversationHistory.push({ 
        role: 'assistant', 
        content: responseContent 
      });

      // Analyze response for metrics
      this.analyzeResponse(input);

      // Check if response suggests meaningful insight
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
    // Get a random example response that hasn't been used recently
    const examples = this.character.messageExamples;
    let responseIndex;
    
    do {
      responseIndex = Math.floor(Math.random() * examples.length);
    } while (responseIndex === this.lastResponseIndex && examples.length > 1);
    
    this.lastResponseIndex = responseIndex;
    
    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: examples[responseIndex][1].content.text
    };
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