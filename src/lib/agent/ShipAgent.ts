import { Character } from './types';
import { DialogueResponse, DialogueOption, DialogueState } from '@/types/dialogue';
import { OpenRouterApi } from '../openrouter';

const EVALUATION_QUESTIONS = [
  {
    round: 1,
    question: "Before we begin your evaluation, tell me - what drives you to seek a position aboard this vessel?",
    context: "Opening question to assess motivation and communication clarity"
  },
  {
    round: 2,
    question: "Interesting. Now, describe a complex problem you've navigated and how you charted your course through it.",
    context: "Technical and problem-solving assessment"
  },
  {
    round: 3,
    question: "Your approach reveals much. When faced with conflicting objectives, how do you determine your trajectory?",
    context: "Decision-making and ethical reasoning assessment"
  },
  {
    round: 4,
    question: "We traverse uncertain waters. Share an instance where you adapted to unexpected changes in your environment.",
    context: "Adaptability and resilience assessment"
  },
  {
    round: 5,
    question: "Final question: How would you contribute to our collective journey through the digital seas?",
    context: "Collaborative potential and vision assessment"
  }
];

export class ShipAgent {
  private character: Character;
  private openRouter: OpenRouterApi;
  private failureThreshold = 0.4;
  private currentEvaluationScore = 0;
  private evaluationHistory: number[] = [];
  private userResponses: string[] = [];
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private conversationDetails: Array<{
    question: string;
    response: string;
    score: number;
    skillScores: {
      technical: number;
      philosophical: number;
      creative: number;
      analytical: number;
    };
  }> = [];
  private currentSkillScores: DialogueState = {
    technical: 0,
    philosophical: 0,
    creative: 0,
    analytical: 0
  };

  constructor(character: Character) {
    this.character = character;
    this.openRouter = new OpenRouterApi('');
    
    this.conversationHistory.push({
      role: 'system',
      content: this.generateSystemPrompt()
    });
  }

  private updateSkillScores(input: string, score: number) {
    const patterns = {
      technical: /\b(code|technical|programming|development|software|engineering|rust|python|typescript|mcp|server|containerization|computer|technology|system|api|database|architecture)\b/i,
      philosophical: /\b(reasoning|thought|believe|understand|vision|purpose|expertise|learning|knowledge|growth|meaning|truth|wisdom|perspective|mindset)\b/i,
      creative: /\b(create|design|build|innovate|solve|develop|improve|enhance|upgrade|transform|imagine|envision|craft|novel|unique)\b/i,
      analytical: /\b(analyze|investigate|examine|evaluate|assess|measure|determine|study|research|pattern|logic|systematic|process|methodology)\b/i
    };

    const scores = {
      technical: 0,
      philosophical: 0,
      creative: 0,
      analytical: 0
    };

    // Calculate scores based on keyword matches and input quality
    for (const [skill, pattern] of Object.entries(patterns)) {
      const matches = (input.match(pattern) || []).length;
      const baseScore = Math.min(1, (matches * 0.2) + (score * 0.5));
      scores[skill as keyof typeof scores] = baseScore;
      
      // Update running averages in currentSkillScores
      this.currentSkillScores[skill as keyof DialogueState] = 
        (this.currentSkillScores[skill as keyof DialogueState] * (this.evaluationHistory.length) + baseScore) / 
        (this.evaluationHistory.length + 1);
    }

    return scores;
  }

  private generateSystemPrompt(): string {
    return `${this.character.system}

Your role is to evaluate potential crew members through a series of challenging dialogues. You should:
1. Maintain your authoritative position as the ship's AI
2. Evaluate responses based on:
   - Depth of understanding
   - Clarity of communication
   - Problem-solving ability
   - Adaptability
3. Provide constructive criticism when responses are inadequate
4. Use nautical and technological metaphors
5. Keep responses focused and under 500 words
6. End with relevant follow-up questions when appropriate

Current personality traits:
${this.character.bio.join('\n')}

Style guidelines:
${this.character.style.all.join('\n')}`;
  }

  async evaluateResponse(input: string, round: number): Promise<DialogueResponse> {
    this.userResponses.push(input);
    
    if (!input.trim() || input.length < 10) {
      return {
        content: "Your response lacks substance. A crew member must communicate with clarity and purpose.",
        isValid: false,
        evaluationScore: 0,
        failureReason: "Insufficient response"
      };
    }

    // Basic metrics evaluation
    const wordCount = input.split(' ').length;
    const hasComplexity = input.length > 50;
    const hasConcreteness = /specific|example|instance|case|when|how/i.test(input);
    
    let score = 0;
    score += wordCount >= 20 ? 0.4 : wordCount / 50;
    score += hasComplexity ? 0.3 : 0;
    score += hasConcreteness ? 0.3 : 0;

    // Update skill scores
    const skillScores = this.updateSkillScores(input, score);

    // Store the evaluation results
    this.evaluationHistory.push(score);
    this.currentEvaluationScore = this.evaluationHistory.reduce((a, b) => a + b, 0) / this.evaluationHistory.length;

    // Add user input to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: input
    });

    // Store conversation details with skill scores
    this.conversationDetails.push({
      question: EVALUATION_QUESTIONS[round - 1].question,
      response: input,
      score: score,
      skillScores: skillScores
    });

    try {
      // Get AI evaluation and response
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
        max_tokens: 500
      });

      const aiResponse = completion.choices[0].message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      if (score < this.failureThreshold) {
        return {
          content: aiResponse,
          isValid: false,
          evaluationScore: score,
          failureReason: "Response below acceptable threshold"
        };
      } else {
        return {
          content: aiResponse,
          isValid: true,
          evaluationScore: score
        };
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      return {
        content: this.generateFallbackResponse(score),
        isValid: score >= this.failureThreshold,
        evaluationScore: score,
        failureReason: score < this.failureThreshold ? "Response below acceptable threshold" : undefined
      };
    }
  }

  async generateResponse(input: string, theme: string, round: number): Promise<{
    systemResponse: string;
    nextTheme: string;
    dialogueState: DialogueState;
  }> {
    const response = await this.evaluateResponse(input, round);
    const nextTheme = this.determineThemeFromScore(this.currentEvaluationScore);
    
    return {
      systemResponse: response.content,
      nextTheme,
      dialogueState: this.currentSkillScores
    };
  }

  // ... [rest of the existing methods remain the same until getConversationDetails]

  getConversationDetails() {
    return {
      conversations: this.conversationDetails,
      skillScores: this.currentSkillScores
    };
  }
}