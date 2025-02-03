import { NetworkData, NetworkNode, NetworkLink } from '@/types/network';
import { NetworkUpdate } from './parser';

const baseSize = 24;
const childSize = 16;
const baseColors = {
  core: "rgb(244, 117, 96)",
  primary: "rgb(97, 205, 187)",
  secondary: "rgb(232, 193, 160)"
};

export function updateNetworkData(
  currentData: NetworkData,
  update: NetworkUpdate
): NetworkData {
  const newNodes: NetworkNode[] = [
    // Keep core node
    currentData.nodes.find(n => n.id === "MCP Server")!,
    
    // Keep primary category nodes
    ...currentData.nodes.filter(n => 
      ["AI Models", "Company Resources", "LLM Clients"].includes(n.id)
    )
  ];

  const newLinks: NetworkLink[] = [
    // Keep core connections
    ...currentData.links.filter(l => 
      l.source === "MCP Server" && 
      ["AI Models", "Company Resources", "LLM Clients"].includes(l.target)
    )
  ];

  // Process updates for each category
  if (update.llm_clients) {
    update.llm_clients.forEach(client => {
      newNodes.push({
        id: client.id,
        size: childSize,
        height: 0,
        color: baseColors.secondary
      });
      newLinks.push({
        source: "LLM Clients",
        target: client.id,
        distance: 50
      });
    });
  }

  if (update.ai_models) {
    update.ai_models.forEach(model => {
      newNodes.push({
        id: model.id,
        size: childSize,
        height: 0,
        color: baseColors.secondary
      });
      newLinks.push({
        source: "AI Models",
        target: model.id,
        distance: 50
      });
    });
  }

  if (update.company_resources) {
    update.company_resources.forEach(resource => {
      newNodes.push({
        id: resource.id,
        size: childSize,
        height: 0,
        color: baseColors.secondary
      });
      newLinks.push({
        source: "Company Resources",
        target: resource.id,
        distance: 50
      });
    });
  }

  return {
    nodes: newNodes,
    links: newLinks
  };
}