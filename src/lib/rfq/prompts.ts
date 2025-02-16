import { RFQSection } from './types';

export const RFQ_SECTIONS: RFQSection[] = [
  {
    id: 'project_overview',
    name: 'Project Overview',
    required: true,
    prompts: [
      'What is the main purpose of this RFQ?',
      'What are the high-level objectives?'
    ],
    dataHints: [
      'Previous similar projects',
      'Historical success metrics',
      'Industry benchmarks'
    ]
  },
  {
    id: 'scope',
    name: 'Scope of Work',
    required: true,
    prompts: [
      'What specific deliverables are required?',
      'What are the key milestones?'
    ],
    dataHints: [
      'Standard operating procedures',
      'Quality control requirements',
      'Compliance records'
    ]
  },
  {
    id: 'timeline',
    name: 'Timeline',
    required: true,
    prompts: [
      'What is the expected project duration?',
      'Are there any critical deadlines?'
    ],
    dataHints: [
      'Historical project timelines',
      'Resource availability data',
      'Seasonal constraints'
    ]
  },
  {
    id: 'requirements',
    name: 'Technical Requirements',
    required: true,
    prompts: [
      'What are the technical specifications?',
      'Are there any compliance requirements?'
    ],
    dataHints: [
      'Technical documentation',
      'Compliance frameworks',
      'Industry certifications'
    ]
  },
  {
    id: 'evaluation',
    name: 'Evaluation Criteria',
    required: true,
    prompts: [
      'What are the key vendor selection criteria?',
      'How will proposals be evaluated?'
    ],
    dataHints: [
      'Vendor performance history',
      'Quality metrics',
      'Cost benchmarks'
    ]
  }
] as const;