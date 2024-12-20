// ... (previous imports and EVALUATION_QUESTIONS remain the same)

export class ShipAgent {
  // ... (previous properties remain the same)
  private conversationDetails: Array<{
    question: string;
    response: string;
    score: number;
  }> = [];

  // ... (previous methods remain the same until evaluateResponse)

  async evaluateResponse(input: string, round: number): Promise<DialogueResponse> {
    try {
      // ... (previous evaluation code remains the same)

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
        max_tokens: 500  // Increased from 150 to 500
      });

      const aiResponse = completion.choices[0].message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Store conversation details
      this.conversationDetails.push({
        question: EVALUATION_QUESTIONS[round - 1].question,
        response: input,
        score: score
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
      // ... (error handling remains the same)
    }
  }

  // Add new method to get conversation history
  getConversationDetails() {
    return this.conversationDetails;
  }

  // ... (rest of the methods remain the same)
}
