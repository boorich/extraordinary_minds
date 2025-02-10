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
    { title: cardContent.rag.title, description: cardContent.rag.description },
    { title: cardContent.functions.title, description: cardContent.functions.description },
    { title: cardContent.applications.title, description: cardContent.applications.description },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <CardSection items={cards} />
    </main>
  );
}