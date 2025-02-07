import { NetworkData, NetworkNode, NetworkLink } from '@/types/network';
import { NetworkUpdate } from './parser';

const baseColors = {
  core: "rgb(244, 117, 96)",
  primary: "rgb(97, 205, 187)",
  secondary: "rgb(232, 193, 160)",
  implementation: "rgb(200, 170, 140)"
};

export function updateNetworkData(
  currentData: NetworkData,
  update: NetworkUpdate
): NetworkData {
  console.log('=== Network Update Start ===');
  console.log('Current data:', currentData);
  console.log('Update:', update);

  // Deep clone current nodes and links
  const newNodes = [...currentData.nodes];
  const newLinks = [...currentData.links];
  
  // Helper to check if a node exists
  const hasNode = (id: string) => newNodes.some(n => n.id === id);
  
  // Helper to check if a link exists
  const hasLink = (source: string, target: string) => 
    newLinks.some(l => l.source === source && l.target === target);

  // Helper to add implementation
  const addComponent = (categoryId: string, component: any) => {
    if (!hasNode(component.id)) {
      // Add new node
      newNodes.push({
        id: component.id,
        size: component.size,
        height: component.height,
        color: component.height === 0 ? baseColors.implementation : baseColors.secondary,
        metadata: {
          title: component.id,
          description: `${component.id} component`,
          type: component.height === 0 ? 'Implementation' : 'Category',
          details: component.details || {}
        }
      });
      
      // Add link to parent category
      if (!hasLink(categoryId, component.id)) {
        newLinks.push({
          source: categoryId,
          target: component.id,
          distance: component.height === 0 ? 30 : 50
        });
      }
    }
  };

  // Process updates for each category
  if (update.llm_clients?.length) {
    update.llm_clients.forEach(client => {
      addComponent("LLM Clients", client);
    });
  }

  if (update.ai_models?.length) {
    update.ai_models.forEach(model => {
      addComponent("AI Models", model);
    });
  }

  if (update.company_resources?.length) {
    update.company_resources.forEach(resource => {
      addComponent("Company Resources", resource);
    });
  }

  // Clean up orphaned nodes and links
  const validNodes = new Set([
    "MCP Server", 
    "AI Models", 
    "Company Resources", 
    "LLM Clients",
    ...newNodes.map(n => n.id)
  ]);

  // Remove any links that reference non-existent nodes
  const validLinks = newLinks.filter(link => 
    validNodes.has(link.source) && validNodes.has(link.target)
  );

  console.log('=== Network Update End ===');
  console.log('Updated data:', { nodes: newNodes, links: validLinks });
  
  return {
    nodes: newNodes,
    links: validLinks
  };
}