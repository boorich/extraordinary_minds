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

  // ... (rest of the existing code)

  private generateDynamicOptions(input: string): DialogueOption[] {
    const options: DialogueOption[] = [];
    
    // Analyze the current conversation metrics to generate contextual options
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;
    
    // Base options that are always available
    const baseOptions: DialogueOption[] = [
      { 
        label: 'Continue Exploring', 
        value: 'continue', 
        type: 'default' 
      }
    ];

    // Generate contextual options based on conversation metrics
    if (technical > philosophical && technical > creative) {
      options.push(
        { 
          label: 'Dive Deeper into Technical Details', 
          value: 'technical_deep_dive', 
          type: 'technical' 
        }
      );
    }

    if (philosophical > technical && philosophical > analytical) {
      options.push(
        { 
          label: 'Explore Philosophical Implications', 
          value: 'philosophical_reflection', 
          type: 'philosophical' 
        }
      );
    }

    if (creative > analytical && creative > technical) {
      options.push(
        { 
          label: 'Discuss Creative Perspectives', 
          value: 'creative_exploration', 
          type: 'creative' 
        }
      );
    }

    if (analytical > creative && analytical > philosophical) {
      options.push(
        { 
          label: 'Analyze Systematic Approach', 
          value: 'analytical_breakdown', 
          type: 'analytical' 
        }
      );
    }

    // Add some randomness to keep conversation fresh
    if (Math.random() < 0.3) {
      options.push(
        { 
          label: 'Unexpected Tangent', 
          value: 'wild_card', 
          type: 'random' 
        }
      );
    }

    // Combine and return options, ensuring at least base options
    return options.length > 0 ? options : baseOptions;
  }

  private determineNextTheme(input: string): string {
    const currentTheme = this.context.currentTheme;
    const { technical, philosophical, creative, analytical } = this.context.userMetrics;

    // Thematic progression based on conversation metrics
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

    // Default fallback and progression
    const nextTheme = themeProgression[currentTheme] || 'initial_contact';

    // Update context
    this.context.currentTheme = nextTheme;

    return nextTheme;
  }

  // Rest of the existing code remains the same
}