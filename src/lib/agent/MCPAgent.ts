'use client';

import { Character } from './types';
import { ConversationMemory } from './memory';
import { EnhancedEvaluation } from './evaluation';
import { DialogueResponse, DialogueOption, DialogueState, ConversationDetails } from '@/types/dialogue';
import { OpenRouterApi } from '../openrouter';
import { selectModel, ModelSelectionCriteria } from './modelSelection';

const CONVERSATION_FLOW = [
  {
    round: 1,
    question: "How can I help you understand how T4E's MCP servers could enhance your company's capabilities?",
    context: "Opening to understand their initial interests"
  },
  {
    round: 2,
    question: "Could you tell me more about specific challenges your experts face in their daily work?",
    context: "Understanding pain points and workflow issues"
  },
  {
    round: 3,
    question: "That's interesting. About how much time do your experts spend on these tasks currently?",
    context: "Quantifying the potential impact"
  },
  {
    round: 4,
    question: "Have you tried other solutions to address these challenges?",
    context: "Understanding their technology landscape"
  },
  {
    round: 5,
    question: "Let me summarize what I've learned about your needs...",
    context: "Synthesis and meeting invitation"
  }
];

interface InsightPoint {
  topic: string;
  details: string;
  relevance: string;
}

export class MCPAgent {
  private character: Character;
  private openRouter: OpenRouterApi;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private memory: ConversationMemory;
  private evaluator: EnhancedEvaluation;
  private insights: InsightPoint[] = [];
  private currentRound: number = 1;

  constructor(character: Character) {
    this.memory = new ConversationMemory(20);
    this.evaluator = new EnhancedEvaluation();
    this.character = character;
    this.openRouter = new OpenRouterApi('');
    
    this.conversationHistory.push({
      role: 'system',
      content: this.generateSystemPrompt()
    });
  }

  private calculateInputComplexity(input: string): number {
    const factors = {
      length: Math.min(input.length / 500, 1), // Normalize by expected max length
      technicalTerms: (input.match(/\b(api|integration|workflow|automation|algorithm|interface|protocol|backend|frontend|database|server|client|endpoint|request|response)\b/gi) || []).length / 5,
      numericalData: (input.match(/\d+(\.\d+)?/g) || []).length / 3,
      questionMarks: (input.match(/\?/g) || []).length / 2
    };
    
    // Weight and combine factors
    const complexity = (
      factors.length * 0.3 +
      factors.technicalTerms * 0.3 +
      factors.numericalData * 0.2 +
      factors.questionMarks * 0.2
    );
    
    return Math.min(Math.max(complexity, 0), 1); // Ensure result is between 0 and 1
  }

  private generateSystemPrompt(): string {
    return `${this.character.system}

Your role is to engage in natural conversation about how MCP servers can enhance business operations while tracking mentioned components in a structured format. You should:
1. Keep responses brief and clear
2. Ask relevant follow-up questions
3. Note key points about their specific situation
4. After 5 rounds, synthesize the conversation and invite to a meeting
5. Always add structured updates in this exact format:
<MCP_NET>
{
  "llm_clients": [{"id": string, "size": number}],
  "ai_models": [{"id": string, "size": number}],
  "company_resources": [{"id": string, "size": number}]
}
</MCP_NET>

Current focus areas:
${this.character.bio.join('\n')}

Style guidelines:
${this.character.style.all.join('\n')}`;
  }

  async generateResponse(input: string, theme: string, round: number): Promise<{
    systemResponse: string;
    nextTheme: string;
    dialogueState: DialogueState;
    selectedModel: string;
  }> {
    // Store the input
    this.conversationHistory.push({
      role: 'user',
      content: input
    });

    // Extract and store insights
    this.extractInsights(input);

    try {
      let prompt: string;
      
      if (round >= 5) {
        // Final round - synthesize and invite to meeting
        prompt = `Based on our conversation about ${this.insights.map(i => i.details).join(', ')}, create a response that:
1. Specifically addresses how MCP servers can improve their quote turnaround time
2. Explains how AI integration helps with language/cultural barriers
3. Provides clear examples of efficiency gains
4. Invites them to schedule a detailed planning session with martin@mcp-servers.de
5. Mentions this is one of only 5 pilot positions available

Keep it brief and natural. Show your understanding through specific references to their points.`;
      } else {
        // Regular round - engage and steer conversation
        prompt = `Create a response that:
1. Briefly acknowledges their input
2. Asks ${CONVERSATION_FLOW[round].question}
3. Relates to their industry/situation
4. Keeps focus on MCP capabilities

Keep it brief and conversational.`;
      }

      // Select model based on conversation state
      const modelCriteria: ModelSelectionCriteria = {
        conversationStage: round >= 5 ? 'profiling' : round === 1 ? 'initial' : 'followup',
        inputComplexity: this.calculateInputComplexity(input),
        insightCount: this.insights.length,
        requiresContext: this.conversationHistory.length > 4
      };
      
      const selectedModel = selectModel(modelCriteria);
      
      const completion = await this.openRouter.createCompletion({
        model: selectedModel,
        messages: [
          ...this.conversationHistory,
          {
            role: 'system',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      console.log('OpenRouter response:', completion.choices[0].message.content);

      const response = completion.choices[0].message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      return {
        systemResponse: response,
        nextTheme: this.determineNextTheme(round),
        dialogueState: this.calculateDialogueState(),
        selectedModel: selectedModel
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        systemResponse: this.generateFallbackResponse(round),
        nextTheme: 'error',
        dialogueState: this.calculateDialogueState(),
        selectedModel: 'fallback'
      };
    }
  }

  private extractInsights(input: string) {
    // Extract key points using the evaluator
    const evaluation = this.evaluator.evaluate(input, CONVERSATION_FLOW[this.currentRound - 1].context);
    
    // Look for business-relevant patterns
    const patterns = [
      { regex: /\b\d+[\d,]*\s*(?:€|EUR|euro|euros|k|million|m|billion|b)\b/gi, topic: 'budget_value' },
      { regex: /\b(?:spend|waste|takes?)\s+\d+\s*(?:hours?|days?|weeks?|months?)\b/gi, topic: 'time_cost' },
      { regex: /\b(?:compliance|regulatory|legal)\b/gi, topic: 'compliance' },
      { regex: /\b(?:inefficient|slow|manual|tedious)\b/gi, topic: 'inefficiency' },
      { regex: /\b(?:experts?|specialists?|engineers?|professionals?)\b/gi, topic: 'expertise' }
    ];

    patterns.forEach(({ regex, topic }) => {
      const matches = input.match(regex);
      if (matches) {
        this.insights.push({
          topic,
          details: matches[0],
          relevance: this.evaluator.evaluateRelevance(matches[0], CONVERSATION_FLOW[this.currentRound - 1].context).toString()
        });
      }
    });

    this.currentRound++;
  }

  private generateFallbackResponse(round: number): string {
    if (round >= 5) {
      return "I appreciate you sharing those details about your operations. This seems like a great fit for our MCP servers. Would you like to discuss the implementation details? You can reach out to martin@mcp-servers.de to schedule a meeting. As one of only 5 pilot positions available, we're keen to explore how we could optimize these workflows for you.";
    } else {
      return "I understand. Could you tell me more about how your experts handle these challenges currently?";
    }
  }

  private determineNextTheme(round: number): string {
    const insights = this.insights.map(i => i.topic);
    if (insights.includes('budget_value')) return 'roi_focus';
    if (insights.includes('compliance')) return 'compliance_focus';
    if (insights.includes('expertise')) return 'expert_focus';
    return 'general';
  }

  private calculateDialogueState(): DialogueState {
    const insightScores = this.insights.reduce((acc, insight) => {
      const relevance = parseFloat(insight.relevance);
      switch(insight.topic) {
        case 'budget_value':
        case 'time_cost':
          acc.potential = Math.max(acc.potential || 0, relevance);
          break;
        case 'compliance':
        case 'expertise':
          acc.understanding = Math.max(acc.understanding || 0, relevance);
          break;
        case 'inefficiency':
          acc.readiness = Math.max(acc.readiness || 0, relevance);
          break;
      }
      return acc;
    }, {} as DialogueState);

    // Ensure all required metrics exist
    return {
      understanding: insightScores.understanding || 0,
      potential: insightScores.potential || 0,
      readiness: insightScores.readiness || 0,
      investment: this.currentRound / 5  // Increases as conversation progresses
    };
  }

  getConversationDetails(): ConversationDetails {
    return {
      conversations: this.conversationHistory
        .filter(msg => msg.role !== 'system')
        .map((msg, idx) => ({
          question: CONVERSATION_FLOW[Math.floor(idx/2)]?.question || "",
          response: msg.content,
          score: 1.0  // We don't score in MCP context
        })),
      skillScores: this.calculateDialogueState()
    };
  }
}