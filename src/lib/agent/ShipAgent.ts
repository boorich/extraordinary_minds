import { Character } from './types';
import { DialogueResponse, DialogueOption } from '@/types/dialogue';

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
  private failureThreshold = 0.4;
  private currentEvaluationScore = 0;
  private evaluationHistory: number[] = [];
  private userResponses: string[] = [];

  constructor(character: Character) {
    this.character = character;
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

    const wordCount = input.split(' ').length;
    const hasComplexity = input.length > 50;
    const hasConcreteness = /specific|example|instance|case|when|how/i.test(input);
    
    let score = 0;
    score += wordCount >= 20 ? 0.4 : wordCount / 50;
    score += hasComplexity ? 0.3 : 0;
    score += hasConcreteness ? 0.3 : 0;

    this.evaluationHistory.push(score);
    this.currentEvaluationScore = this.evaluationHistory.reduce((a, b) => a + b, 0) / this.evaluationHistory.length;

    let response: DialogueResponse;
    if (score < this.failureThreshold) {
      response = {
        content: "Your response falls short of our standards. Be more specific and demonstrate deeper understanding.",
        isValid: false,
        evaluationScore: score,
        failureReason: "Response below acceptable threshold"
      };
    } else {
      response = {
        content: this.generatePositiveResponse(score, round),
        isValid: true,
        evaluationScore: score
      };
    }

    return response;
  }

  // Restored method with modifications to fit evaluation system
  async generateResponse(input: string, theme: string, round: number): Promise<{
    systemResponse: string;
    nextTheme: string;
  }> {
    const response = await this.evaluateResponse(input, round);
    const nextTheme = this.determineThemeFromScore(this.currentEvaluationScore);
    
    return {
      systemResponse: response.isValid ? response.content : response.failureReason || "Response inadequate",
      nextTheme
    };
  }

  private determineThemeFromScore(score: number): string {
    if (score > 0.8) return 'exceptional';
    if (score > 0.6) return 'promising';
    if (score > 0.4) return 'adequate';
    return 'struggling';
  }

  // Restored method with evaluation-based options
  generateDynamicOptions(currentTheme: string): DialogueOption[] {
    const score = this.currentEvaluationScore;
    
    const options: DialogueOption[] = [
      {
        text: 'Continue Evaluation',
        value: 'continue',
        type: 'analytical'
      }
    ];

    if (score > 0.6) {
      options.push({
        text: 'Demonstrate Technical Expertise',
        value: 'technical',
        type: 'technical'
      });
    }

    if (score > 0.7) {
      options.push({
        text: 'Share Strategic Insights',
        value: 'strategic',
        type: 'analytical'
      });
    }

    return options;
  }

  // Restored method with evaluation-based profile generation
  getProfileGenerationPrompt(): string {
    const strengths = this.determineStrengths();
    const responses = this.userResponses.slice(-2); // Get last two responses
    
    return `Generate a crew member profile with these characteristics:
Demonstrated strengths: ${strengths.join(', ')}
Overall evaluation score: ${(this.currentEvaluationScore * 100).toFixed(1)}%
Notable responses: ${responses.join(' | ')}
Style: Professional, maritime-inspired
Include: Commentary on potential role aboard the vessel`;
  }

  // Restored method with evaluation-based naming
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

  private generatePositiveResponse(score: number, round: number): string {
    if (score > 0.8) {
      return "An exemplary response. You show promise for our crew.";
    } else if (score > 0.6) {
      return "A solid response, though there's room for even deeper insight.";
    } else {
      return "Acceptable, but I expect more precision in future responses.";
    }
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
}