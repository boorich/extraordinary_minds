import { DialogueOption } from '@/types/dialogue';
import { AgentConfig, AgentContext, AgentResponse } from './types';
import { GeneratedOptions } from '../openai';

interface ConversationContext {
  userTraits: Map<string, number>;
  interests: string[];
  keyPhrases: string[];
  personalityNotes: string[];
}

export class ShipAgent {
  private config: AgentConfig;
  private context: AgentContext;
  private conversationContext: ConversationContext;
  private currentQuestion: number = 0;

  private readonly QUESTIONS = [
    "What drives your exploration of these digital realms?",
    "How do you approach challenges that seem impossible at first?",
    "What patterns do you notice that others might miss?",
    "Tell me about a moment that changed your perspective entirely.",
    "How do you envision the future of human-AI interaction?",
    "What's the most interesting problem you've solved recently?",
    "What mysteries of consciousness intrigue you most?",
    "How do you balance logic and intuition in your decisions?",
    "What unconventional ideas do you find compelling?",
    "If you could solve any problem, what would it be?"
  ];

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
      personalityNotes: []
    };
  }

  async generateResponse(input: string, theme: string): Promise<GeneratedOptions> {
    // Update context with user's input
    this.analyzeResponse(input);
    this.context.conversationHistory.push({ role: 'user', content: input });

    // Get next question or generate final response
    const systemResponse = this.currentQuestion >= this.QUESTIONS.length 
      ? this.generateFinalInsight()
      : await this.generateContextualResponse(input);

    // Prepare next response including follow-up question
    const nextQuestion = this.QUESTIONS[this.currentQuestion];
    const fullResponse = this.currentQuestion >= this.QUESTIONS.length 
      ? systemResponse
      : `${systemResponse}\n\n${nextQuestion}`;

    this.currentQuestion++;

    return {
      options: this.generateDynamicOptions(input),
      nextTheme: this.determineNextTheme(input),
      systemResponse: fullResponse
    };
  }

  private analyzeResponse(input: string) {
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
    }

    // Extract notable phrases
    if (input.length > 15) {
      this.conversationContext.keyPhrases.push(input);
    }
  }

  private async generateContextualResponse(input: string): Promise<string> {
    const systemPrompt = `
Previous exchange: ${input}
Current metrics: ${JSON.stringify(this.context.userMetrics)}
Interests noted: ${this.conversationContext.interests.join(', ')}
Character style: ${this.config.style.all.join(', ')}
Respond as the Neural Voyager ship AI, keeping responses engaging but concise.
    `.trim();

    try {
      const response = await fetch('/api/agent/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating contextual response:', error);
      return "Your thoughts create intriguing patterns in my neural matrices. Tell me more.";
    }
  }

  private generateFinalInsight(): string {
    const dominantTraits = Object.entries(this.context.userMetrics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => trait);

    const interests = [...new Set(this.conversationContext.interests)]
      .slice(0, 3);

    return `I sense in you a fascinating blend of ${dominantTraits.join(' and ')}.
Your journey through these digital seas has revealed a deep connection to ${interests.join(', ')}.
Let me generate a visualization that captures your unique essence...`;
  }

  public getProfileGenerationPrompt(): string {
    const traits = Object.entries(this.context.userMetrics)
      .sort(([,a], [,b]) => b - a);
    
    const dominantTrait = traits[0][0];
    const keyInterests = [...new Set(this.conversationContext.interests)]
      .slice(0, 3);
    
    const significantPhrases = this.conversationContext.keyPhrases
      .slice(-3);

    return `Create a surreal, symbolic portrait representing a person with these characteristics:
- Dominant trait: ${dominantTrait}
- Key interests: ${keyInterests.join(', ')}
- Notable expressions: ${significantPhrases.join(' | ')}
Style: Ethereal, digital, with elements of ${dominantTrait} symbolism
Mood: Introspective yet dynamic
Include: Abstract neural patterns, symbolic representations of their interests
Color scheme: Deep blues and cyans with ${dominantTrait === 'technical' ? 'electric accents' : 
  dominantTrait === 'philosophical' ? 'ethereal purples' : 
  dominantTrait === 'creative' ? 'vibrant sparks' : 'crystalline structures'}`;
  }

  private generateDynamicOptions(input: string): DialogueOption[] {
    // For the Eliza-style interaction, we don't need predefined options
    // But we need to return something for type compatibility
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