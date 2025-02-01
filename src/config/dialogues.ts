import { DialoguePrompt } from '@/types/dialogue';

export const initialDialogues: DialoguePrompt[] = [
  {
    id: 'welcome',
    text: "How can I help you understand how T4E's MCP servers could enhance your company's capabilities?",
    theme: 'initial_contact',
    context: 'Open-ended start to understand their interests and needs',
    constraints: [
      'Keep responses brief and natural',
      'Ask relevant follow-up questions',
      'Note key points about their situation'
    ],
    fallbackOptions: [
      {
        text: "What does T4E mean?",
        value: 'company_info',
        type: 'understanding',
        score: 0.8
      },
      {
        text: "How would this help our experts?",
        value: 'value_prop',
        type: 'potential',
        score: 0.9
      },
      {
        text: "Tell me about the pilot program.",
        value: 'pilot_info',
        type: 'investment',
        score: 0.7
      }
    ]
  },
  {
    id: 'use_cases',
    text: "Could you tell me more about the specific challenges your experts face in their daily work?",
    theme: 'pain_points',
    context: 'Understanding their current workflow challenges',
    constraints: [
      'Focus on practical problems',
      'Note specific pain points',
      'Connect issues to MCP capabilities'
    ],
    fallbackOptions: [
      {
        text: "Our documentation is hard to search through.",
        value: 'doc_access',
        type: 'understanding',
        score: 0.8
      },
      {
        text: "Data analysis takes too long.",
        value: 'data_analysis',
        type: 'potential',
        score: 0.9
      },
      {
        text: "Experts spend too much time on routine tasks.",
        value: 'efficiency',
        type: 'readiness',
        score: 0.8
      }
    ]
  },
  {
    id: 'current_solutions',
    text: "What solutions have you tried so far to address these challenges?",
    theme: 'current_state',
    context: 'Understanding their technology landscape and previous attempts',
    constraints: [
      'Note current tools and limitations',
      'Identify integration points',
      'Look for quick wins'
    ],
    fallbackOptions: [
      {
        text: "We use various internal tools but they're not connected.",
        value: 'fragmented',
        type: 'understanding',
        score: 0.9
      },
      {
        text: "We've tried some AI tools but they can't access our data.",
        value: 'limited_ai',
        type: 'potential',
        score: 0.8
      },
      {
        text: "Our current process is mostly manual.",
        value: 'manual',
        type: 'readiness',
        score: 0.7
      }
    ]
  },
  {
    id: 'synthesis',
    text: "Based on what you've shared, let me summarize how I think MCP servers could help...",
    theme: 'conclusion',
    context: 'Synthesizing the conversation and demonstrating understanding',
    constraints: [
      'Reference specific points from the conversation',
      'Show clear understanding of their needs',
      'Demonstrate intelligent reasoning',
      'Lead naturally to meeting invitation'
    ],
    fallbackOptions: [
      {
        text: "Would you like to discuss implementing this for your specific needs?",
        value: 'schedule',
        type: 'investment',
        score: 1.0
      }
    ]
  }
];