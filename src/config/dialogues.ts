import { DialoguePrompt } from '@/types/dialogue';

export const initialDialogues: DialoguePrompt[] = [
  {
    id: 'welcome',
    text: "Welcome to T4E. I see you're interested in transforming how your organization works with AI.",
    theme: 'initial_contact',
    context: 'First interaction with potential pilot customer. Establishing their understanding and needs.',
    constraints: [
      'Focus on enterprise transformation',
      'Highlight MCP technology potential',
      'Gauge readiness for pilot program'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "We want to better integrate AI with our existing resources.",
        value: 'understand_integration',
        type: 'understanding',
        score: 0.8
      },
      {
        text: "Our experts need better tools to leverage their knowledge.",
        value: 'expert_enhancement',
        type: 'potential',
        score: 0.9
      },
      {
        text: "We're looking to be early adopters of transformative AI technology.",
        value: 'early_adoption',
        type: 'readiness',
        score: 1.0
      },
      {
        text: "We're evaluating enterprise AI solutions for potential investment.",
        value: 'investment_eval',
        type: 'investment',
        score: 0.7
      }
    ]
  },
  {
    id: 'capabilities',
    text: "MCP servers create a powerful synergy between LLMs, human expertise, and company resources. What aspects of this integration interest you most?",
    theme: 'technological_fit',
    context: 'Understanding their specific needs and use cases.',
    constraints: [
      'Focus on practical applications',
      'Identify key value drivers',
      'Assess technical readiness'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "The ability to connect AI directly with our internal systems.",
        value: 'system_integration',
        type: 'understanding',
        score: 0.9
      },
      {
        text: "Empowering our experts to achieve more with AI assistance.",
        value: 'expert_empowerment',
        type: 'potential',
        score: 0.8
      },
      {
        text: "We have specific workflows that could benefit from this.",
        value: 'workflow_enhancement',
        type: 'readiness',
        score: 1.0
      },
      {
        text: "The potential ROI from enhanced productivity and capabilities.",
        value: 'roi_focus',
        type: 'investment',
        score: 0.9
      }
    ]
  },
  {
    id: 'pilot_interest',
    text: "As one of our first 5 pilot customers, you'll help shape the future of enterprise AI integration. What timeline are you considering for implementation?",
    theme: 'commitment',
    context: 'Assessing readiness for pilot program and creating urgency.',
    constraints: [
      'Emphasize limited pilot spots',
      'Focus on strategic advantages',
      'Gauge investment readiness'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "We'd like to start as soon as possible to gain competitive advantage.",
        value: 'immediate_start',
        type: 'readiness',
        score: 1.0
      },
      {
        text: "We need to understand the integration process better first.",
        value: 'understanding_needed',
        type: 'understanding',
        score: 0.7
      },
      {
        text: "We're prepared to invest if we can see clear value alignment.",
        value: 'value_alignment',
        type: 'investment',
        score: 0.9
      },
      {
        text: "We have pressing use cases that need this solution.",
        value: 'urgent_need',
        type: 'potential',
        score: 0.8
      }
    ]
  }
];