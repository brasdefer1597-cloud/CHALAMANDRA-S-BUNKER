import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { TacticalState } from '../types';

interface TacticalContextType {
  state: TacticalState;
  addAnalyzedPiece: (pieceId: string, remote?: boolean) => void;
  updateGlobalRisk: (risk: number, remote?: boolean) => void;
  setLastStrategy: (strategy: string, remote?: boolean) => void;
  addToHistory: (entry: string, remote?: boolean) => void;
  isSynced: boolean;
}

const STORAGE_KEY = 'chalamandra_tactical_state';

const initialState: TacticalState = {
  analyzedPieces: [],
  globalRiskLevel: 0,
  sessionHistory: [],
  lastStrategy: null,
};

const TacticalContext = createContext<TacticalContextType | undefined>(undefined);

export const TacticalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TacticalState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });
  const [isSynced, setIsSynced] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // WebSocket Sync
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsSynced(true);
      console.log("Connected to Bunker Network");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'TACTICAL_UPDATE') {
        setState(data.payload);
      }
    };

    socket.onclose = () => {
      setIsSynced(false);
      console.log("Disconnected from Bunker Network");
    };

    return () => socket.close();
  }, []);

  const broadcast = (newState: TacticalState) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'TACTICAL_UPDATE',
        payload: newState
      }));
    }
  };

  const addAnalyzedPiece = (pieceId: string, remote = false) => {
    setState(prev => {
      const newState = {
        ...prev,
        analyzedPieces: [...new Set([...prev.analyzedPieces, pieceId])],
      };
      if (!remote) broadcast(newState);
      return newState;
    });
  };

  const updateGlobalRisk = (risk: number, remote = false) => {
    setState(prev => {
      const newState = { ...prev, globalRiskLevel: risk };
      if (!remote) broadcast(newState);
      return newState;
    });
  };

  const setLastStrategy = (strategy: string, remote = false) => {
    setState(prev => {
      const newState = { ...prev, lastStrategy: strategy };
      if (!remote) broadcast(newState);
      return newState;
    });
  };

  const addToHistory = (entry: string, remote = false) => {
    setState(prev => {
      const newState = {
        ...prev,
        sessionHistory: [...prev.sessionHistory, entry].slice(-20),
      };
      if (!remote) broadcast(newState);
      return newState;
    });
  };

  return (
    <TacticalContext.Provider value={{ state, addAnalyzedPiece, updateGlobalRisk, setLastStrategy, addToHistory, isSynced }}>
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
