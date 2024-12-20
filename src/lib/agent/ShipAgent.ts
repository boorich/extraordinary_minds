import { Character } from './types';
import { DialogueResponse, DialogueOption } from '@/types/dialogue';
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
  }> = [];

  constructor(character: Character) {
    this.character = character;
    this.openRouter = new OpenRouterApi('');
    
    // Initialize with system message
    this.conversationHistory.push({
      role: 'system',
      content: this.generateSystemPrompt()
    });
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

    // Store the evaluation results
    this.evaluationHistory.push(score);
    this.currentEvaluationScore = this.evaluationHistory.reduce((a, b) => a + b, 0) / this.evaluationHistory.length;

    // Add user input to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: input
    });

    // Store conversation details for summary
    this.conversationDetails.push({
      question: EVALUATION_QUESTIONS[round - 1].question,
      response: input,
      score: score
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
  }> {
    const response = await this.evaluateResponse(input, round);
    const nextTheme = this.determineThemeFromScore(this.currentEvaluationScore);
    
    return {
      systemResponse: response.content,
      nextTheme
    };
  }

  private determineThemeFromScore(score: number): string {
    if (score > 0.8) return 'exceptional';
    if (score > 0.6) return 'promising';
    if (score > 0.4) return 'adequate';
    return 'struggling';
  }

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
        .split('\n')
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

  private determineOptionType(option: string): 'technical' | 'philosophical' | 'creative' | 'analytical' {
    const patterns = {
      technical: /\b(how|system|code|data|process|technical)\b/i,
      philosophical: /\b(why|meaning|purpose|think|believe|consciousness)\b/i,
      creative: /\b(imagine|create|design|vision|art|future|possible)\b/i,
      analytical: /\b(analyze|pattern|structure|logic|reason|understand)\b/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(option)) {
        return type as 'technical' | 'philosophical' | 'creative' | 'analytical';
      }
    }

    return 'analytical'; // Default type
  }

  private getFallbackOptions(): DialogueOption[] {
    return [{
      text: 'Continue Evaluation',
      value: 'continue',
      type: 'analytical'
    }];
  }

  private generateFallbackResponse(score: number): string {
    if (score < this.failureThreshold) {
      return "Your response falls short of our standards. Be more specific and demonstrate deeper understanding.";
    } else if (score > 0.8) {
      return "An exemplary response. You show promise for our crew.";
    } else if (score > 0.6) {
      return "A solid response, though there's room for even deeper insight.";
    } else {
      return "Acceptable, but I expect more precision in future responses.";
    }
  }

  getProfileGenerationPrompt(): string {
    const strengths = this.determineStrengths();
    const significantResponses = this.conversationHistory
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(-2);
    
    return `Generate a crew member profile with these characteristics:
Demonstrated strengths: ${strengths.join(', ')}
Overall evaluation score: ${(this.currentEvaluationScore * 100).toFixed(1)}%
Notable responses: ${significantResponses.join(' | ')}
Style: Professional, maritime-inspired
Include: Commentary on potential role aboard the vessel`;
  }

  generateExplorerName(): string {
    const score = this.currentEvaluationScore;
    const strengths = this.determineStrengths();
    
    const prefixes = {
      high: ['Navigator', 'Captain', 'Admiral'],
      medium: ['Officer', 'Ensign', 'Pilot'],
      low: ['Recruit', 'Cadet', 'Apprentice']
    };

    const suffixes = strengths.map(str => str.split(' ')[0]);
    
    const prefix = score > 0.7 ? prefixes.high : 
                  score > 0.5 ? prefixes.medium :
                  prefixes.low;
    
    const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${randomPrefix} ${randomSuffix}`;
  }

  getNextQuestion(round: number): string {
    return EVALUATION_QUESTIONS[round - 1]?.question ?? "Evaluation complete.";
  }

  hasPassedEvaluation(): boolean {
    return this.currentEvaluationScore >= this.failureThreshold;
  }

  getFailureReason(): string {
    if (this.evaluationHistory.length === 0) return "Evaluation not completed";
    
    const lowScores = this.evaluationHistory.filter(score => score < this.failureThreshold).length;
    if (lowScores > 2) return "Multiple responses failed to meet minimum standards";
    if (this.currentEvaluationScore < this.failureThreshold) return "Overall evaluation score below threshold";
    
    return "Insufficient demonstration of required capabilities";
  }

  private determineStrengths(): string[] {
    const strengths = [];
    if (this.currentEvaluationScore > 0.7) strengths.push("clear communication");
    if (this.evaluationHistory[1] > 0.7) strengths.push("technical problem-solving");
    if (this.evaluationHistory[2] > 0.7) strengths.push("decision-making");
    if (this.evaluationHistory[3] > 0.7) strengths.push("adaptability");
    if (this.evaluationHistory[4] > 0.7) strengths.push("collaborative potential");
    return strengths;
  }

  getConversationDetails() {
    return this.conversationDetails;
  }
}