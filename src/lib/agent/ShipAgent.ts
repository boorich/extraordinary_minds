import { Character } from './types';
import { DialogueResponse, DialogueOption } from '@/types/dialogue';
import { OpenRouterApi } from '../openrouter';

// ... (previous code remains the same until generateDynamicOptions)

  async generateDynamicOptions(currentTheme: string): Promise<DialogueOption[]> {
    try {
      const completion = await this.openRouter.createCompletion({
        model: "anthropic/claude-3-haiku-20240307",
        messages: [
          ...this.conversationHistory,
          {
            role: 'system',
            content: `Based on the conversation history and current theme '${currentTheme}', generate 3 possible response directions for the user.
Each option should be relevant to their previous responses and encourage deeper exploration.
Format each option as a brief phrase that could be selected by the user.`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      const options = completion.choices[0].message.content
        .split('\\n')
        .filter((opt: string) => opt.trim())
        .map((opt: string): DialogueOption => ({
          text: opt.trim(),
          value: opt.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          type: this.determineOptionType(opt)
        }));

      return options;
    } catch (error) {
      console.error('Error generating options:', error);
      return this.getFallbackOptions();
    }
  }
// ... (rest of the code remains the same)