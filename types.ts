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

export interface TacticalState {
  analyzedPieces: string[];
  globalRiskLevel: number;
  sessionHistory: string[];
  lastStrategy: string | null;
}

export interface ImageGenerationConfig {
  aspectRatio: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
}

export type ChatMessage = {
  role: 'user' | 'model';
  parts: { 
    text?: string; 
    inlineData?: { mimeType: string; data: string };
    fileData?: { mimeType: string; fileUri: string };
  }[];
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
