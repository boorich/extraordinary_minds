import { Character } from './types';
import { DialogueResponse } from '@/types/dialogue';

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
  private failureThreshold = 0.4; // 40% minimum score required
  private currentEvaluationScore = 0;
  private evaluationHistory: number[] = [];

  constructor(character: Character) {
    this.character = character;
  }

  async evaluateResponse(input: string, round: number): Promise<DialogueResponse> {
    // Here you would typically make an API call to your AI model
    // For now, we'll implement basic evaluation logic
    
    if (!input.trim() || input.length < 10) {
      return {
        content: "Your response lacks substance. A crew member must communicate with clarity and purpose.",
        isValid: false,
        evaluationScore: 0,
        failureReason: "Insufficient response"
      };
    }

    // Calculate basic evaluation metrics
    const wordCount = input.split(' ').length;
    const hasComplexity = input.length > 50;
    const hasConcreteness = /specific|example|instance|case|when|how/i.test(input);
    
    let score = 0;
    score += wordCount >= 20 ? 0.4 : wordCount / 50;
    score += hasComplexity ? 0.3 : 0;
    score += hasConcreteness ? 0.3 : 0;

    this.evaluationHistory.push(score);
    this.currentEvaluationScore = this.evaluationHistory.reduce((a, b) => a + b, 0) / this.evaluationHistory.length;

    // Generate appropriate response based on score
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

  getExplorerProfile(): string {
    if (!this.hasPassedEvaluation()) return "";
    
    // Generate profile based on evaluation history and scores
    const strengths = this.determineStrengths();
    return `A promising recruit showing particular aptitude in ${strengths.join(", ")}.`;
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