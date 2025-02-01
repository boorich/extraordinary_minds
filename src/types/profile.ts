export interface ProfileMetrics {
  // MCP-focused metrics
  understanding: number;
  potential: number;
  readiness: number;
  investment: number;
  
  // Legacy metrics (kept for backward compatibility)
  technical?: number;
  philosophical?: number;
  creative?: number;
  analytical?: number;
}

export interface Profile {
  name: string;
  imageUrl: string;
  description: string;
  metrics: ProfileMetrics;
  profileId: string;
}