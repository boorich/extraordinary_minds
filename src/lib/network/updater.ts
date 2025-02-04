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
  console.log('=== Network Update Start ===');
  console.log('Current data:', currentData);
  console.log('Update:', update);

  // Start with existing nodes
  const newNodes = [...currentData.nodes];
  
  // Helper to check if a node exists
  const hasNode = (id: string) => newNodes.some(n => n.id === id);

  // Start with existing links
  const newLinks = [...currentData.links];
  
  // Helper to check if a link exists
  const hasLink = (source: string, target: string) => 
    newLinks.some(l => l.source === source && l.target === target);

  // Process updates for each category
  if (update.llm_clients) {
    update.llm_clients.forEach(client => {
      if (!hasNode(client.id)) {
        newNodes.push({
        id: client.id,
        size: childSize,
        height: 0,
        color: baseColors.secondary
      });
      }
      if (!hasLink("LLM Clients", client.id)) {
        if (!hasLink("AI Models", model.id)) {
        if (!hasLink("Company Resources", resource.id)) {
        newLinks.push({
        source: "LLM Clients",
        target: client.id,
        distance: 50
      });
    });
  }

  if (update.ai_models) {
    update.ai_models.forEach(model => {
      if (!hasNode(model.id)) {
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
      if (!hasNode(resource.id)) {
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