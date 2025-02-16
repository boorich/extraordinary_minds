import { MCPAgent } from './MCPAgent';
import { Character } from './types';
import { NetworkUpdate } from '../network/parser';
import { RFQInsight } from '@/types/rfq';
import { DialogueState } from '@/types/dialogue';

export class RFQAgent extends MCPAgent {
  private requirements: Map<string, any> = new Map();
  
  constructor(config: Character) {
    super(config);
  }

  async generateResponse(
    input: string,
    theme: string,
    round: number
  ): Promise<{
    systemResponse: string;
    nextTheme: string;
    dialogueState: DialogueState;
    selectedModel: string;
    networkUpdate: NetworkUpdate;
  }> {
    // Enhance the context with RFQ-specific guidance
    const enhancedInput = `${input}
Context: RFQ Template Generation
Goal: Create a professional and comprehensive RFQ template through conversation.
Guidelines:
- Extract specific requirements and specifications
- Identify industry standards and best practices
- Look for potential gaps or ambiguities
- Suggest improvements based on similar RFQs
- Note opportunities where MCP integration could enhance the process`;

    // Get base response from parent class
    const baseResponse = await super.generateResponse(input, theme, round);

    // Extract RFQ-specific insights and requirements
    const extractedInfo = this.extractRequirementsAndInsights(input + ' ' + baseResponse.systemResponse);

    // Create network nodes based on RFQ content
    const rfqNodes = {
      company_resources: [
        {
          id: 'rfq_template',
          size: 24,
          height: 1,
          color: 'rgb(232, 193, 160)',
          title: 'RFQ Template',
          description: 'Dynamic RFQ generation system'
        }
      ],
      ai_models: [
        {
          id: 'requirement_analyzer',
          size: 20,
          height: 1,
          color: 'rgb(97, 205, 187)',
          title: 'Requirement Analyzer',
          description: 'AI-powered RFQ analysis'
        }
      ],
      llm_clients: []
    };

    // Add requirement-specific nodes
    extractedInfo.requirements.forEach((value, key) => {
      rfqNodes.company_resources.push({
        id: `requirement_${key}`,
        size: 16,
        height: 0,
        color: 'rgb(232, 193, 160)',
        title: key.charAt(0).toUpperCase() + key.slice(1),
        description: `RFQ ${key} requirements`,
        parent: 'rfq_template'
      });
    });

    // Create network update with both base structure and RFQ metadata
    const networkUpdate: NetworkUpdate & { metadata?: { rfq_components?: { insights: RFQInsight[] } } } = {
      ...rfqNodes,
      metadata: {
        ...baseResponse.networkUpdate.metadata,
        rfq_components: {
          insights: extractedInfo.insights
        }
      }
    };

    // Update dialogue state with RFQ-specific metrics
    const dialogueState: DialogueState = {
      ...baseResponse.dialogueState,
      understanding: this.calculateUnderstandingScore(extractedInfo),
      potential: this.calculatePotentialScore(extractedInfo),
      readiness: this.calculateReadinessScore(extractedInfo),
      investment: this.calculateInvestmentScore(extractedInfo)
    };

    return {
      systemResponse: baseResponse.systemResponse,
      nextTheme: baseResponse.nextTheme,
      dialogueState,
      selectedModel: baseResponse.selectedModel,
      networkUpdate
    };
  }

  private extractRequirementsAndInsights(text: string): {
    requirements: Map<string, any>;
    insights: RFQInsight[];
  } {
    const insights: RFQInsight[] = [];
    const requirements = this.requirements;
    
    // Example insight generation (would be replaced with actual NLP)
    if (text.toLowerCase().includes('deadline')) {
      insights.push({
        type: 'info',
        message: 'Timeline Requirements Detected',
        details: 'Consider adding specific milestone dates to strengthen the RFQ'
      });
      requirements.set('timeline', { hasDeadlines: true });
    }

    if (text.toLowerCase().includes('quality')) {
      insights.push({
        type: 'success',
        message: 'Quality Standards Specified',
        details: 'MCP integration could automate quality control tracking'
      });
      requirements.set('quality', { hasStandards: true });
    }

    return {
      requirements,
      insights
    };
  }

  private calculateUnderstandingScore(info: ReturnType<typeof this.extractRequirementsAndInsights>): number {
    // Calculate how well the user understands RFQ requirements
    return Math.min(100, info.requirements.size * 20);
  }

  private calculatePotentialScore(info: ReturnType<typeof this.extractRequirementsAndInsights>): number {
    // Calculate potential for MCP integration
    return Math.min(100, info.insights.length * 25);
  }

  private calculateReadinessScore(info: ReturnType<typeof this.extractRequirementsAndInsights>): number {
    // Calculate readiness for advanced features
    const hasQuality = info.requirements.has('quality');
    const hasTimeline = info.requirements.has('timeline');
    return Math.min(100, (hasQuality ? 50 : 0) + (hasTimeline ? 50 : 0));
  }

  private calculateInvestmentScore(info: ReturnType<typeof this.extractRequirementsAndInsights>): number {
    // Calculate potential investment in MCP solutions
    return Math.min(100, info.insights.filter(i => i.type === 'success').length * 33);
  }
}