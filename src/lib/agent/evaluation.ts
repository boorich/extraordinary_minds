import { SkillScores } from './types';

export interface EvaluationResult {
  scores: SkillScores;
  overallScore: number;
  reasoning: string;
  coherence: number;
  relevance: number;
}

export class EnhancedEvaluation {
  // Structural indicators of quality responses
private qualityIndicators = {
    // Does the response provide specific examples?
    hasExamples: (text: string): boolean => {
      return text.includes('for example') || 
             text.includes('such as') || 
             text.includes('instance') ||
             /[Ww]hen I|[Ww]here I/.test(text);
    },
    
    // Does it show cause-and-effect reasoning?
    hasCausality: (text: string): boolean => {
      return text.includes('because') || 
             text.includes('therefore') || 
             text.includes('since') || 
             text.includes('as a result');
    },
    
    // Does it acknowledge complexity/tradeoffs?
    hasNuance: (text: string): boolean => {
      return text.includes('however') || 
             text.includes('although') || 
             text.includes('while') || 
             text.includes('on the other hand');
    },
    
    // Does it draw conclusions?
    hasConclusions: (text: string): boolean => {
      return text.includes('ultimately') || 
             text.includes('in conclusion') || 
             text.includes('thus') || 
             text.includes('consequently');
    }
  };

  evaluateCoherence(input: string): number {
    // Check for sentence structure and flow
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) return 0.5;

    const coherenceScore = sentences.reduce((score, sentence, idx) => {
      if (idx === 0) return score;
      const prevWords = new Set(sentences[idx - 1].toLowerCase().split(' '));
      const currentWords = new Set(sentence.toLowerCase().split(' '));
      const commonWords = Array.from(prevWords).filter(word => currentWords.has(word));
      return score + (commonWords.length > 0 ? 1 : 0);
    }, 0) / (sentences.length - 1);

    return coherenceScore;
  }

  evaluateRelevance(input: string, context: string): number {
    const contextKeywords = new Set(context.toLowerCase().split(' '));
    const inputWords = new Set(input.toLowerCase().split(' '));
    const commonWords = [...contextKeywords].filter(word => inputWords.has(word));
    
    return Math.min(commonWords.length / contextKeywords.size, 1);
  }

  calculateDetailedScores(input: string, context: string): SkillScores {
    const scores: SkillScores = {
      technical: 0,
      philosophical: 0,
      creative: 0,
      analytical: 0
    };

    // Base score from structural quality indicators
    const qualityScore = Object.keys(this.qualityIndicators)
      .reduce((score, key) => score + (this.qualityIndicators[key as keyof typeof this.qualityIndicators](input) ? 0.25 : 0), 0);

    // Analyze response structure
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = input.length / sentences.length;
    const hasGoodStructure = avgSentenceLength > 10 && avgSentenceLength < 30;

    // Look for question engagement
    const addressesQuestion = input.toLowerCase().includes(context.toLowerCase().slice(0, 20));

    // Calculate depth score
    const depthIndicators = {
      technical: this.qualityIndicators.hasExamples(input) && this.qualityIndicators.hasCausality(input),
      philosophical: this.qualityIndicators.hasNuance(input) && sentences.length > 3,
      creative: Array.from(new Set(input.split(' '))).length / input.split(' ').length > 0.7, // vocabulary richness
      analytical: this.qualityIndicators.hasCausality(input) && this.qualityIndicators.hasConclusions(input)
    };

    // Combine scores
    for (const skill in scores) {
      scores[skill as keyof SkillScores] = (
        qualityScore * 0.4 +
        (hasGoodStructure ? 0.2 : 0) +
        (addressesQuestion ? 0.2 : 0) +
        (depthIndicators[skill as keyof typeof depthIndicators] ? 0.2 : 0)
      );
    }

    return scores;
  }

  combine(coherence: number, relevance: number, scores: SkillScores): number {
    const skillAverage = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
    return (coherence * 0.3 + relevance * 0.3 + skillAverage * 0.4);
  }

  evaluate(input: string, context: string): EvaluationResult {
    const coherence = this.evaluateCoherence(input);
    const relevance = this.evaluateRelevance(input, context);
    const scores = this.calculateDetailedScores(input, context);
    const overallScore = this.combine(coherence, relevance, scores);

    return {
      scores,
      overallScore,
      coherence,
      relevance,
      reasoning: this.generateReasoning(scores, coherence, relevance)
    };
  }

  private generateReasoning(scores: SkillScores, coherence: number, relevance: number): string {
    const strongestSkill = Object.entries(scores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    const weakestSkill = Object.entries(scores)
      .reduce((a, b) => a[1] < b[1] ? a : b)[0];

    return `Strong in ${strongestSkill}, needs improvement in ${weakestSkill}. ` +
           `Coherence: ${(coherence * 100).toFixed()}%, Relevance: ${(relevance * 100).toFixed()}%`;
  }
}