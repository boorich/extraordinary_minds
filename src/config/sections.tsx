import { Github, Users } from 'lucide-react';
import { SectionsData } from '@/types';

export const sections: SectionsData = {
  traits: [
    {
      title: "The Obsessed",
      description: "You've been called crazy. Mad. Obsessive. Because you see what others can't, and you'll spend countless nights bringing those visions to life. Not for glory, but because those ideas consume you."
    },
    {
      title: "The Relentless",
      description: "While others seek comfort, you seek challenges. Your greatest achievements aren't your past successes, but the impossible problems you're solving right now."
    }
  ],
  manifesto: [
    {
      title: "Our Mission",
      description: "To unite the extraordinary few who don't just push boundaries - they ignore them entirely. We're building autonomous systems that will reshape reality itself. Not because it's profitable, but because it's the greatest challenge we can imagine."
    },
    {
      title: "The Code",
      description: "Excellence isn't our goal - it's our baseline. We reject mediocrity in all its forms. Every line of code, every system design, every decision must push the boundaries of what's possible."
    },
    {
      title: "The Promise",
      description: "Here, you'll find your tribe. Other brilliantly obsessed minds who understand that true greatness comes not from chasing profits, but from the relentless pursuit of excellence."
    }
  ],
  crew: [
    "The midnight architect who can't sleep because the perfect solution is almost within reach",
    "The visionary who sees the matrix in their dreams and wakes up with breakthrough algorithms",
    "The perpetual learner who devours knowledge not for acclaim, but for the sheer joy of understanding",
    "The quiet genius whose greatest satisfaction comes from solving the 'impossible' problem"
  ],
  credibility: [
    {
      icon: <Github className="w-6 h-6" />,
      stat: "0",
      label: "Open Source Contributions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      stat: "1",
      label: "Crewmates"
    }
  ]
};