import { Character } from './types';
import { DialogueResponse, DialogueOption, DialogueState, ConversationDetails } from '@/types/dialogue';
import { OpenRouterApi } from '../openrouter';

// Keep EVALUATION_QUESTIONS constant as is...

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
  private currentSkillScores = {
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

    const scores: {[key: string]: number} = {
      technical: 0,
      philosophical: 0,
      creative: 0,
      analytical: 0
    };

    // Calculate scores based on keyword matches and input quality
    for (const [skill, pattern] of Object.entries(patterns)) {
      const matches = (input.match(pattern) || []).length;
      const baseScore = Math.min(1, (matches * 0.2) + (score * 0.5));
      scores[skill] = baseScore;
      
      // Update running averages in currentSkillScores
      const currentScore = this.currentSkillScores[skill as keyof typeof this.currentSkillScores];
      this.currentSkillScores[skill as keyof typeof this.currentSkillScores] = 
        ((currentScore * this.evaluationHistory.length) + baseScore) / 
        (this.evaluationHistory.length + 1);
    }

    return scores;
  }

  // Keep all other methods the same until getConversationDetails...

  getConversationDetails(): ConversationDetails {
    return {
      conversations: this.conversationDetails,
      skillScores: this.currentSkillScores
    };
  }

  // All other methods remain the same...
  [rest of the file content exactly as before...]