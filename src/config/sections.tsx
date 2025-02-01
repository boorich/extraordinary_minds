import { Brain, Cpu, Database, Users, Workflow, BarChart } from 'lucide-react';
import { SectionsData } from '@/types';

export const sections: SectionsData = {
  traits: [
    {
      title: "The Innovators",
      description: "You understand that AI isn't just another tool - it's a transformation catalyst. Your company has the expertise and resources to lead in your industry, but you need the right technology to amplify your capabilities."
    },
    {
      title: "The Pioneers",
      description: "You see the limitations of current AI solutions in the enterprise. You know that real value comes from connecting AI with your company's unique expertise and resources, not from generic chatbots."
    },
    {
      title: "The Visionaries",
      description: "You recognize that being among the first to properly integrate AI into your core operations isn't just an opportunity - it's a competitive necessity. You're ready to shape the future of your industry."
    }
  ],
  manifesto: [
    {
      title: "The Vision",
      description: "We're building the bridge between enterprise knowledge and AI capabilities. Our Model Context Protocol servers don't just connect systems - they create a new paradigm where human expertise, AI, and company resources work in perfect synergy."
    },
    {
      title: "The Promise",
      description: "As one of our first 5 pilot customers, you'll help shape the future of enterprise AI integration. This isn't just about implementing technology - it's about transforming how your experts work and how your company delivers value."
    },
    {
      title: "The Impact",
      description: "Phase 1 enhances your experts' capabilities. Phase 2 transforms your entire production process. Together, we're not just improving efficiency - we're redefining what's possible in your industry."
    }
  ],
  crew: [
    "Forward-thinking enterprises that understand the transformative power of properly integrated AI",
    "Companies with deep domain expertise ready to amplify their capabilities through MCP technology",
    "Organizations that recognize the competitive advantage of being among the first to properly connect AI with their resources",
    "Businesses ready to invest in becoming industry leaders in the AI age"
  ],
  credibility: [
    {
      icon: <Brain className="w-6 h-6" />,
      stat: "3x",
      label: "Expert Productivity Enhancement"
    },
    {
      icon: <Database className="w-6 h-6" />,
      stat: "100%",
      label: "Resource Integration"
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      stat: "5",
      label: "Pilot Positions Available"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      stat: "2x",
      label: "Production Efficiency (Phase 2)"
    }
  ]
};