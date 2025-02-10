import { CardSection } from '@/components/CardSection';
import { analyzeNetworkForTooling, generateCardContent } from '@/lib/mcp/toolRecommendations';

export default function ToolsPage() {
  // Create empty NetworkData to satisfy type requirements
  const emptyNetworkData = {
    nodes: [],
    links: []
  };
  const recommendations = analyzeNetworkForTooling(emptyNetworkData);
  const cardContent = generateCardContent(recommendations);

  const cards = [
    { title: cardContent.data.title, description: cardContent.data.description },
    { title: cardContent.cloud.title, description: cardContent.cloud.description },
    { title: cardContent.client.title, description: cardContent.client.description },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <CardSection items={cards} />
    </main>
  );
}