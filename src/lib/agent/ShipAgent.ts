import { Character } from './types';
import { DialogueResponse, DialogueOption, DialogueState, ConversationDetails } from '@/types/dialogue';
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

interface SkillScores {
  technical: number;
  philosophical: number;
  creative: number;
  analytical: number;
}

interface AIEvaluation {
  scores: SkillScores;
  overallScore: number;
  reasoning: string;
}

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
    skillScores: SkillScores;
  }> = [];
  private currentSkillScores: SkillScores = {
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

  private async getLLMEvaluation(input: string, round: number): Promise<AIEvaluation> {
    try {
      const completion = await this.openRouter.createCompletion({
        model: "anthropic/claude-3-sonnet-20240229",
        messages: [
          {
            role: 'system',
            content: `You are evaluating a response to: "${EVALUATION_QUESTIONS[round - 1].question}"
Context: ${EVALUATION_QUESTIONS[round - 1].context}

Rate each dimension 0.0-1.0 and provide a brief reasoning.
Return only JSON:
{
  "scores": {
    "technical": <0.0-1.0>,
    "philosophical": <0.0-1.0>,
    "creative": <0.0-1.0>,
    "analytical": <0.0-1.0>
  },
  "overallScore": <0.0-1.0>,
  "reasoning": "<25 words max>"
}`
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response as AIEvaluation;
    } catch (error) {
      console.error('Error getting LLM evaluation:', error);
      return {
        scores: {
          technical: 0.5,
          philosophical: 0.5,
          creative: 0.5,
          analytical: 0.5
        },
        overallScore: 0.5,
        reasoning: "Fallback evaluation due to error."
      };
    }
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

    // Get AI evaluation
    const evaluation = await this.getLLMEvaluation(input, round);
    const score = evaluation.overallScore;

    // Update averages
    this.evaluationHistory.push(score);
    this.currentEvaluationScore = this.evaluationHistory.reduce((a, b) => a + b, 0) / this.evaluationHistory.length;

    // Update skill scores (using AI evaluation)
    Object.entries(evaluation.scores).forEach(([skill, value]) => {
      const currentScore = this.currentSkillScores[skill as keyof SkillScores];
      this.currentSkillScores[skill as keyof SkillScores] = 
        ((currentScore * (this.evaluationHistory.length - 1)) + value) / 
        this.evaluationHistory.length;
    });

    // Add user input to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: input
    });

    // Store conversation details
    this.conversationDetails.push({
      question: EVALUATION_QUESTIONS[round - 1].question,
      response: input,
      score: score,
      skillScores: evaluation.scores
    });

    try {
      // Get AI response with next question
      const nextQuestion = round < EVALUATION_QUESTIONS.length ? EVALUATION_QUESTIONS[round].question : null;
      const nextContext = round < EVALUATION_QUESTIONS.length ? EVALUATION_QUESTIONS[round].context : null;
      
      const completion = await this.openRouter.createCompletion({
        model: "anthropic/claude-3-sonnet-20240229",
        messages: [
          ...this.conversationHistory,
          {
            role: 'system',
            content: `Keep your response under 250 tokens and follow this exact format:

[EVALUATION]
Brief feedback on previous response (2-3 sentences)

${nextQuestion ? `[NEXT CHALLENGE - READ CAREFULLY]
${nextQuestion}

Evaluation Context: ${nextContext}
>>> Please address this specific question in your next response. <<<` : '[EVALUATION COMPLETE]'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      const aiResponse = completion.choices[0].message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return {
        content: aiResponse,
        isValid: score >= this.failureThreshold,
        evaluationScore: score,
        failureReason: score < this.failureThreshold ? "Response below acceptable threshold" : undefined
      };
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
    // We need at least 4 responses
    if (this.evaluationHistory.length < 4) return false;
    
    // If average score is above 80%, it should always pass
    if (this.currentEvaluationScore >= 0.8) return true;
    
    // For scores between threshold and 80%, require at least 4 responses
    const hasHighEnoughScore = this.currentEvaluationScore >= this.failureThreshold;
    const hasCompletedMinRounds = this.evaluationHistory.length >= 4;
    
    return hasHighEnoughScore && hasCompletedMinRounds;
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

  getConversationDetails(): ConversationDetails {
    return {
      conversations: this.conversationDetails,
      skillScores: this.currentSkillScores
    };
  }
}