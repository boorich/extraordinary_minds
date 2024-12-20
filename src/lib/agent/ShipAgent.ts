import { Character } from './types';
import { DialogueResponse, DialogueOption, DialogueState, ConversationDetails } from '@/types/dialogue';
import { OpenRouterApi } from '../openrouter';

// ... [Previous code remains the same until the evaluateResponse method] ...

  async evaluateResponse(input: string, round: number): Promise<DialogueResponse> {
    // ... [Previous code remains the same until the createCompletion call] ...

      const completion = await this.openRouter.createCompletion({
        model: "anthropic/claude-3-sonnet-20240229",
        messages: [
          ...this.conversationHistory,
          {
            role: 'system',
            content: `Current evaluation score: ${score.toFixed(2)}
Round: ${round}/5
Context: ${EVALUATION_QUESTIONS[round - 1].context}

If the response quality is below ${this.failureThreshold}, be stern but constructive in your criticism.
If the response is adequate or better, acknowledge strengths while encouraging deeper insight.
Provide a thorough analysis of their response before asking a follow-up question.`
          }
        ],
        temperature: 0.7,
        max_tokens: 250  // Reduced from 500 to 250
      });

    // ... [Rest of evaluateResponse method remains the same] ...
  }

  // ... [Middle code remains the same until generateDynamicOptions method] ...

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
        max_tokens: 100  // Already at 100, we'll keep this one as is since it's already low
      });

    // ... [Rest of the file remains exactly the same] ...
