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

  // ... (previous code remains the same)

  public generateDynamicOptions(input: string): DialogueOption[] {
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    // Base options with correct type and score
    const baseOptions: DialogueOption[] = [
      { 
        text: 'Continue Exploring', 
        type: 'analytical',  // Using 'analytical' as default
        score: 50,
        nextPrompt: 'continue' 
      }
    ];

    const options: DialogueOption[] = [];

    // Generate contextual options based on conversation metrics
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

    // Add some randomness to keep conversation fresh
    if (Math.random() < 0.3) {
      options.push(
        { 
          text: 'Unexpected Tangent', 
          type: 'creative',  // Using 'creative' for randomness
          score: 50,
          nextPrompt: 'wild_card'
        }
      );
    }

    // Combine and return options, ensuring at least base options
    return options.length > 0 ? options : baseOptions;
  }

  // ... (rest of the previous code remains the same)
}