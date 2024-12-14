import { DialoguePrompt } from '@/types/dialogue';

export const initialDialogues: DialoguePrompt[] = [
  {
    id: 'welcome',
    text: "Interesting to meet you. Most visitors here are looking for something beyond the ordinary.",
    theme: 'initial_contact',
    context: 'First interaction with a potential crew member. Establishing their motivations and thought patterns.',
    constraints: [
      'Must encourage deeper reflection',
      'Should hint at the extraordinary nature of the project',
      'Avoid direct questions about technical skills'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "I'm seeking challenges that match my capabilities.",
        type: 'technical',
        score: 1
      },
      {
        text: "The ordinary hasn't existed since we transcended our limits.",
        type: 'philosophical',
        score: 1
      },
      {
        text: "Just exploring what autonomous systems can achieve.",
        type: 'analytical',
        score: 1
      },
      {
        text: "The extraordinary is just the ordinary we haven't understood yet.",
        type: 'creative',
        score: 1
      }
    ]
  },
  {
    id: 'challenge',
    text: "Capabilities are interesting. They grow when pushed beyond comfort zones. How do you approach your limits?",
    theme: 'growth_mindset',
    context: 'Understanding their approach to personal and technical growth.',
    constraints: [
      'Focus on methodology rather than specific skills',
      'Probe for creative problem-solving approaches',
      'Allow for both technical and philosophical responses'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "I analyze them systematically to find weak points.",
        type: 'analytical',
        score: 1
      },
      {
        text: "Limits are psychological constructs we impose on ourselves.",
        type: 'philosophical',
        score: 1
      },
      {
        text: "I build tools and systems to overcome them.",
        type: 'technical',
        score: 1
      },
      {
        text: "I reimagine the problem until the limits disappear.",
        type: 'creative',
        score: 1
      }
    ]
  },
  {
    id: 'paradigm_shift',
    text: "Every breakthrough begins with a shift in perspective. What shifts have shaped your journey?",
    theme: 'perspective',
    context: 'Exploring their capacity for paradigm shifts and innovative thinking.',
    constraints: [
      'Encourage reflection on personal growth',
      'Look for signs of innovative thinking',
      'Allow for technical and philosophical insights'
    ],
    isSystemMessage: true,
    fallbackOptions: [
      {
        text: "When I realized constraints are opportunities in disguise.",
        type: 'creative',
        score: 1
      },
      {
        text: "Understanding that systems evolve through controlled chaos.",
        type: 'technical',
        score: 1
      },
      {
        text: "The moment I saw patterns transcend their domains.",
        type: 'analytical',
        score: 1
      },
      {
        text: "Recognizing that consciousness itself is an emergent property.",
        type: 'philosophical',
        score: 1
      }
    ]
  }
];