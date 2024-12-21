# [Previous content remains the same until hasPassedEvaluation method]

  hasPassedEvaluation(): boolean {
    // Check if we have enough responses
    if (this.evaluationHistory.length === 0) return false;
    
    // Calculate required scores
    const averageScore = this.currentEvaluationScore;
    const minimumScore = 0.4; // 40% threshold
    
    // Skills thresholds
    const hasAdequateSkills = Object.values(this.currentSkillScores).every(score => score >= minimumScore);
    
    // Overall criteria
    const hasGoodAverageScore = averageScore >= minimumScore;
    const hasEnoughResponses = this.evaluationHistory.length >= 4;
    const noLowScores = !this.evaluationHistory.some(score => score < minimumScore);
    
    // Debug logging
    console.log('Evaluation Status:', {
      averageScore,
      hasAdequateSkills,
      hasGoodAverageScore,
      hasEnoughResponses,
      noLowScores,
      scores: this.evaluationHistory,
      skills: this.currentSkillScores
    });
    
    return hasGoodAverageScore && hasEnoughResponses && noLowScores && hasAdequateSkills;
  }

# [Rest of file remains exactly the same]