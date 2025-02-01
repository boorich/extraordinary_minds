import { NextResponse } from 'next/server';
import { DialogueOption } from '@/types/dialogue';
import { Profile, ProfileMetrics } from '@/types/profile';

function generateProfileDescription(choices: DialogueOption[], name: string) {
  const metrics = choices.reduce((acc, choice) => {
    if (choice.type) {
      acc[choice.type] = (acc[choice.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedTraits = Object.entries(metrics)
    .sort(([,a], [,b]) => b - a)
    .map(([type]) => type);

  const primaryTrait = sortedTraits[0] || 'potential';
  const secondaryTrait = sortedTraits[1] || 'readiness';

  const traitDescriptions: Record<string, string> = {
    understanding: "visionary who deeply understands the transformative power of MCP technology",
    potential: "leader recognizing the immense business potential of AI integration",
    readiness: "pioneer ready to transform their industry through MCP servers",
    investment: "strategic innovator committed to leading the AI revolution",
    // Legacy traits (kept for backward compatibility)
    technical: "technical innovator in enterprise AI",
    philosophical: "strategic thinker in digital transformation",
    creative: "visionary in AI integration",
    analytical: "data-driven decision maker"
  };

  return `A profile of ${name}, a ${traitDescriptions[primaryTrait]} with strong ${traitDescriptions[secondaryTrait]}. Their organization stands at the forefront of enterprise AI transformation, ready to harness the power of Model Context Protocol servers. The profile emphasizes their commitment to connecting AI capabilities with domain expertise and company resources, creating a synergy that will define the future of their industry. Their vision combines practical implementation with strategic foresight, positioning them as an ideal pilot customer for T4E's groundbreaking technology.`;
}

function calculateMetrics(choices: DialogueOption[]): ProfileMetrics {
  const counts = choices.reduce((acc, choice) => {
    if (choice.type) {
      acc[choice.type] = (acc[choice.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const total = Math.max(1, Object.values(counts).reduce((sum, count) => sum + count, 0));

  return {
    // MCP-focused metrics
    understanding: Math.round(((counts.understanding || 0) / total) * 100),
    potential: Math.round(((counts.potential || 0) / total) * 100),
    readiness: Math.round(((counts.readiness || 0) / total) * 100),
    investment: Math.round(((counts.investment || 0) / total) * 100),
    // Legacy metrics (kept for backward compatibility)
    technical: Math.round(((counts.technical || 0) / total) * 100),
    philosophical: Math.round(((counts.philosophical || 0) / total) * 100),
    creative: Math.round(((counts.creative || 0) / total) * 100),
    analytical: Math.round(((counts.analytical || 0) / total) * 100),
  };
}

export async function POST(req: Request) {
  try {
    const { name, choices } = await req.json();

    if (!name || !choices || !Array.isArray(choices)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Generate profile description and metrics
    const description = generateProfileDescription(choices, name);
    const metrics = calculateMetrics(choices);

    // Return initial profile without image
    const profile: Profile = {
      name,
      imageUrl: '', // Will be updated later
      description,
      metrics,
      profileId: Date.now().toString() // For tracking the profile
    };

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Profile generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}