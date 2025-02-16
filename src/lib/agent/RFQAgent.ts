import { MCPAgent } from './MCPAgent';
import { Character } from './types';
import { NetworkUpdate } from '../network/parser';
import { RFQInsight } from '@/types/rfq';

export class RFQAgent extends MCPAgent {
  private requirements: Map<string, any> = new Map();
  
  constructor(config: Character) {
    super(config);
  }

  async generateResponse(
    userInput: string,
    context: string,
    turnCount: number
  ): Promise<{
    systemResponse: string;
    selectedModel: string;
    requirements?: Map<string, any>;
    insights?: RFQInsight[];
  }> {
    // Enhance the context with RFQ-specific guidance
    const enhancedContext = `${context}
Consider the following for RFQ template generation:
- Extract specific requirements and specifications
- Identify industry standards and best practices
- Look for potential gaps or ambiguities
- Suggest improvements based on similar RFQs
- Note opportunities where MCP integration could enhance the process`;

    const response = await super.generateResponse(userInput, enhancedContext, turnCount);

    // Extract requirements and generate insights
    const extractedInfo = this.extractRequirementsAndInsights(userInput + ' ' + response.systemResponse);

    return {
      ...response,
      requirements: extractedInfo.requirements,
      insights: extractedInfo.insights
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

  async generateNetworkUpdate(text: string): Promise<NetworkUpdate | null> {
    const baseUpdate = await super.generateNetworkUpdate(text);
    const extractedInfo = this.extractRequirementsAndInsights(text);
    
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

    const update: NetworkUpdate & { metadata?: { rfq_components?: { insights: RFQInsight[] } } } = {
      ...rfqNodes,
      metadata: {
        rfq_components: {
          insights: extractedInfo.insights
        }
      }
    };

    return update;
  }
}