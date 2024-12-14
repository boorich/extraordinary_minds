import { DialoguePrompt } from '@/types/dialogue';

export const initialDialogues: DialoguePrompt[] = [
  {
    id: 'welcome',
    text: "Interesting to meet you. Most visitors here are looking for something beyond the ordinary.",
    isSystemMessage: true,
    options: [
      {
        text: "I'm seeking challenges that match my capabilities.",
        type: 'technical',
        nextPrompt: 'challenge',
        score: 1
      },
      {
        text: "The ordinary hasn't existed since we transcended our limits.",
        type: 'philosophical',
        nextPrompt: 'transcendence',
        score: 1
      },
      {
        text: "Just exploring what autonomous systems can achieve.",
        type: 'analytical',
        nextPrompt: 'exploration',
        score: 1
      },
      {
        text: "The extraordinary is just the ordinary we haven't understood yet.",
        type: 'creative',
        nextPrompt: 'understanding',
        score: 1
      }
    ]
  },
  {
    id: 'challenge',
    text: "Capabilities are interesting. They grow when pushed beyond comfort zones. How do you approach your limits?",
    isSystemMessage: true,
    options: [
      {
        text: "I analyze them systematically to find weak points.",
        type: 'analytical',
        nextPrompt: 'systematic',
        score: 1
      },
      {
        text: "Limits are psychological constructs we impose on ourselves.",
        type: 'philosophical',
        nextPrompt: 'psychology',
        score: 1
      },
      {
        text: "I build tools and systems to overcome them.",
        type: 'technical',
        nextPrompt: 'tools',
        score: 1
      },
      {
        text: "I reimagine the problem until the limits disappear.",
        type: 'creative',
        nextPrompt: 'reimagine',
        score: 1
      }
    ]
  },
  // Additional prompts to be added...
];