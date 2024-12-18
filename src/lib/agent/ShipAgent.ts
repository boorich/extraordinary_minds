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

  // ... (rest of the previous implementation remains the same)
}