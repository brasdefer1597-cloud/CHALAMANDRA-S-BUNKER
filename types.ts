import { LucideIcon } from 'lucide-react';

export interface ChessPiece {
  id: string;
  name: string;
  criminalRole: string;
  description: string;
  chessFunction: string;
  criminalFunction: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  icon: LucideIcon | string;
  color: string;
}

export interface StrategyTactic {
  id: string;
  title: string;
  chessConcept: string;
  criminalConcept: string;
  icon: LucideIcon;
}

export type ChatMessage = {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
};

export interface GroundingLink {
  title: string;
  uri: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
