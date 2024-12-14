export interface CardItem {
  title: string;
  description: string;
}

export interface CredibilityItem {
  icon: React.ReactNode;
  stat: string;
  label: string;
}

export interface CardSectionProps {
  title: string;
  items: CardItem[] | string[];
  variant?: "default" | "crew";
}

export interface SectionsData {
  traits: CardItem[];
  manifesto: CardItem[];
  crew: string[];
  credibility: CredibilityItem[];
}