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

  // Start with existing nodes and links
  const newNodes = [...currentData.nodes];
  const newLinks = [...currentData.links];
  
  // Helper to check if a node exists
  const hasNode = (id: string) => newNodes.some(n => n.id === id);
  
  // Helper to check if a link exists
  const hasLink = (source: string, target: string) => 
    newLinks.some(l => l.source === source && l.target === target);

  // Helper to add a link with the correct distance based on node heights
  const addLink = (source: string, target: string) => {
    const sourceNode = newNodes.find(n => n.id === source);
    const targetNode = newNodes.find(n => n.id === target);
    
    if (sourceNode && targetNode) {
      // Shorter distances for parent-child relationships
      const distance = Math.abs(sourceNode.height - targetNode.height) === 1 ? 30 : 50;
      
      if (!hasLink(source, target)) {
        newLinks.push({ source, target, distance });
      }
    }
  };

  // Process updates for each category
  if (update.llm_clients) {
    update.llm_clients.forEach(client => {
      if (!hasNode(client.id)) {
        newNodes.push({
          id: client.id,
          size: client.size,
          height: client.height,
          color: client.height === 0 ? baseColors.implementation : baseColors.secondary
        });

        // Connect to parent category if it's an implementation
        if (client.height === 0) {
          addLink("LLM Clients", client.id);
        } else {
          addLink("MCP Server", "LLM Clients");
        }
      }
    });
  }

  if (update.ai_models) {
    update.ai_models.forEach(model => {
      if (!hasNode(model.id)) {
        newNodes.push({
          id: model.id,
          size: model.size,
          height: model.height,
          color: model.height === 0 ? baseColors.implementation : baseColors.secondary
        });

        // Connect to parent category if it's an implementation
        if (model.height === 0) {
          addLink("AI Models", model.id);
        } else {
          addLink("MCP Server", "AI Models");
        }
      }
    });
  }

  if (update.company_resources) {
    update.company_resources.forEach(resource => {
      if (!hasNode(resource.id)) {
        newNodes.push({
          id: resource.id,
          size: resource.size,
          height: resource.height,
          color: resource.height === 0 ? baseColors.implementation : baseColors.secondary
        });

        // Connect to parent category if it's an implementation
        if (resource.height === 0) {
          addLink("Company Resources", resource.id);
        } else {
          addLink("MCP Server", "Company Resources");
        }
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