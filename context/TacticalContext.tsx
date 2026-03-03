import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TacticalState } from '../types';

interface TacticalContextType {
  state: TacticalState;
  addAnalyzedPiece: (pieceId: string) => void;
  updateGlobalRisk: (risk: number) => void;
  setLastStrategy: (strategy: string) => void;
  addToHistory: (entry: string) => void;
}

const initialState: TacticalState = {
  analyzedPieces: [],
  globalRiskLevel: 0,
  sessionHistory: [],
  lastStrategy: null,
};

const TacticalContext = createContext<TacticalContextType | undefined>(undefined);

export const TacticalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TacticalState>(initialState);

  const addAnalyzedPiece = (pieceId: string) => {
    setState(prev => ({
      ...prev,
      analyzedPieces: [...new Set([...prev.analyzedPieces, pieceId])],
    }));
  };

  const updateGlobalRisk = (risk: number) => {
    setState(prev => ({ ...prev, globalRiskLevel: risk }));
  };

  const setLastStrategy = (strategy: string) => {
    setState(prev => ({ ...prev, lastStrategy: strategy }));
  };

  const addToHistory = (entry: string) => {
    setState(prev => ({
      ...prev,
      sessionHistory: [...prev.sessionHistory, entry].slice(-20), // Keep last 20
    }));
  };

  return (
    <TacticalContext.Provider value={{ state, addAnalyzedPiece, updateGlobalRisk, setLastStrategy, addToHistory }}>
      {children}
    </TacticalContext.Provider>
  );
};

export const useTactical = () => {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error('useTactical must be used within a TacticalProvider');
  }
  return context;
};
