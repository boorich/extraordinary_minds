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

  // Start with core and category nodes
  const newNodes = [
    // Core node
    currentData.nodes.find(n => n.id === "MCP Server")!,
    // Category nodes
    ...currentData.nodes.filter(n => 
      ["AI Models", "Company Resources", "LLM Clients"].includes(n.id)
    )
  ];
  
  // Start with core category links
  const newLinks = [
    ...currentData.links.filter(l => 
      l.source === "MCP Server" && 
      ["AI Models", "Company Resources", "LLM Clients"].includes(l.target)
    )
  ];
  
  // Helper to check if a node exists
  const hasNode = (id: string) => newNodes.some(n => n.id === id);
  
  // Helper to check if a link exists
  const hasLink = (source: string, target: string) => 
    newLinks.some(l => l.source === source && l.target === target);

  // Helper to add implementation
  const addImplementation = (categoryId: string, impl: any) => {
    if (!hasNode(impl.id)) {
      newNodes.push({
        id: impl.id,
        size: impl.size,
        height: impl.height,
        color: impl.height === 0 ? baseColors.implementation : baseColors.secondary
      });
      
      if (!hasLink(categoryId, impl.id)) {
        // Add link from category to implementation
        newLinks.push({
          source: categoryId,
          target: impl.id,
          distance: 30 // Shorter distance for parent-child relationship
        });
      }
    }
  };

  // Process updates for each category
  if (update.llm_clients) {
    update.llm_clients.forEach(client => {
      const categoryId = client.height === 0 ? "LLM Clients" : "MCP Server";
      if (client.height === 0) {
        addImplementation("LLM Clients", client);
      }
    });
  }

  if (update.ai_models) {
    update.ai_models.forEach(model => {
      const categoryId = model.height === 0 ? "AI Models" : "MCP Server";
      if (model.height === 0) {
        addImplementation("AI Models", model);
      }
    });
  }

  if (update.company_resources) {
    update.company_resources.forEach(resource => {
      const categoryId = resource.height === 0 ? "Company Resources" : "MCP Server";
      if (resource.height === 0) {
        addImplementation("Company Resources", resource);
      }
    });
  }

  console.log('=== Network Update End ===');
  console.log('Updated data:', { nodes: newNodes, links: newLinks });
  
  return {
    nodes: newNodes,
    links: newLinks
  };
}