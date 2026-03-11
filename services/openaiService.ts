import { ChatMessage, ChessPiece, TacticalState } from '../types';

const API_ENDPOINT = '/api/openai-chat';

class OpenAIServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIServiceError';
  }
}

async function callOpenAI(body: Record<string, any>): Promise<string> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new OpenAIServiceError(errorData.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}

// --- CORE INTELLIGENCE (OpenAI) ---

export const analyzeThinkingOpenAI = async (prompt: string): Promise<string> => {
  try {
    return await callOpenAI({ action: 'analyze', prompt });
  } catch (e: any) {
    throw new OpenAIServiceError("The bunker's brain is saturated. Retry the move.");
  }
};

export const generateCounterStrategyOpenAI = async (piece: ChessPiece, tacticalState?: TacticalState): Promise<string> => {
  try {
    return await callOpenAI({
      action: 'counter-strategy',
      pieceContext: {
        name: piece.name,
        criminalRole: piece.criminalRole,
        description: piece.description,
        criminalFunction: piece.criminalFunction,
        riskLevel: piece.riskLevel,
      },
      tacticalContext: tacticalState ? {
        analyzedPieces: tacticalState.analyzedPieces,
        globalRiskLevel: tacticalState.globalRiskLevel,
        lastStrategy: tacticalState.lastStrategy,
      } : undefined,
    });
  } catch (e: any) {
    throw new OpenAIServiceError("Intelligence server failure.");
  }
};

export const generateChatContentOpenAI = async (history: ChatMessage[]): Promise<string> => {
  try {
    const messages = history.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.parts.map(p => p.text || '').join(''),
    }));

    return await callOpenAI({ action: 'chat', messages });
  } catch (e: any) {
    throw new OpenAIServiceError("Connection lost with the Tactical Analyst.");
  }
};

export const simulateScenarioOpenAI = async (scenario: string): Promise<string> => {
  try {
    return await callOpenAI({ action: 'simulate', prompt: scenario });
  } catch (e: any) {
    throw new OpenAIServiceError("Error in the scenario simulator.");
  }
};
