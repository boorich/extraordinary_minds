export interface ProfileMetrics {
  technical: number;
  philosophical: number;
  creative: number;
  analytical: number;
}

export interface Profile {
  name: string;
  imageUrl: string;
  description: string;
  metrics: ProfileMetrics;
}