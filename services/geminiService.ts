
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { ChatMessage, ChessPiece } from '../types';

// La API Key se obtiene de process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

class GeminiServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

// --- CORE INTELLIGENCE ---

export const analyzeThinking = async (prompt: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
                systemInstruction: "Eres la Decodificadora Magistral. Tono: 'Malandra Fresa'. Analiza con profundidad extrema, sin rodeos, callejera pero fina."
            }
        });
        return response.text || "";
    } catch (e) {
        throw new GeminiServiceError("El cerebro del búnker está saturado. Reintenta la movida.");
    }
};

export const searchGrounding = async (query: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    return {
        text: response.text,
        links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
            title: c.web?.title || "Enlace",
            uri: c.web?.uri
        })) || []
    };
};

export const mapsGrounding = async (query: string, lat?: number, lng?: number) => {
    const ai = getAI();
    const config: any = { tools: [{ googleMaps: {} }, { googleSearch: {} }] };
    if (lat && lng) {
        config.toolConfig = { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } };
    }
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config
    });
    return {
        text: response.text,
        links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
            title: c.maps?.title || "Ubicación",
            uri: c.maps?.uri
        })) || []
    };
};

// FIX: Added generateCounterStrategy to handle piece-specific tactical analysis
export const generateCounterStrategy = async (piece: ChessPiece): Promise<string> => {
    const ai = getAI();
    const prompt = `Analiza al arquetipo '${piece.criminalRole}' (basado en el '${piece.name}' de ajedrez). 
    Descripción: ${piece.description}. 
    Función criminal: ${piece.criminalFunction}. 
    Nivel de riesgo: ${piece.riskLevel}.
    
    Proporciona un plan detallado de neutralización o contra-estrategia.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: "Eres la Decodificadora Magistral. Tono: 'Malandra Fresa'. Proporciona tácticas de neutralización criminal usando analogías de ajedrez. Sé concisa y letal."
            }
        });
        return response.text || "Error en el análisis táctico.";
    } catch (e) {
        throw new GeminiServiceError("Fallo en el servidor de inteligencia.");
    }
};

// FIX: Added generateChatContent to handle chatbot interactions
export const generateChatContent = async (history: ChatMessage[]): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: history.map(m => ({
                role: m.role,
                parts: m.parts.map(p => ({ text: p.text }))
            })),
            config: {
                systemInstruction: "Eres 'Analista Táctico', un experto en la analogía del 'Ajedrez Criminal'. Mantén un tono profesional, analítico y enigmático. Responde sobre roles y estrategias."
            }
        });
        return response.text || "Sin respuesta táctica.";
    } catch (e) {
        throw new GeminiServiceError("Conexión perdida con el Analista Táctico.");
    }
};

// FIX: Added simulateScenario to handle strategic simulations
export const simulateScenario = async (scenario: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Simula la contra-movida de las autoridades ante este escenario: ${scenario}`,
            config: {
                systemInstruction: "Eres la Inteligencia del Búnker. Tu tarea es predecir la respuesta táctica (la 'Contra-Movida') de las autoridades o rivales ante un movimiento criminal propuesto."
            }
        });
        return response.text || "Simulación fallida.";
    } catch (e) {
        throw new GeminiServiceError("Error en el simulador de escenarios.");
    }
};

// --- MULTIMEDIA GENERATION ---

export const generateVideoVeo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinemática táctica de búnker, estilo Chalamandra: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });
    while (!operation.done) {
        await new Promise(r => setTimeout(r, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
    }
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${uri}&key=${process.env.API_KEY}`;
};

export const generateImagePro = async (prompt: string, size: '1K' | '2K' | '4K', ratio: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: `Iconografía criminal de alto nivel, estética neón fucsia y verde ácido: ${prompt}`,
        config: { imageConfig: { imageSize: size, aspectRatio: ratio as any } }
    });
    const part = response.candidates?.[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export const editImageFlash = async (base64Img: string, prompt: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Img.split(',')[1], mimeType: 'image/png' } },
                { text: `Modifica esta imagen táctica: ${prompt}` }
            ]
        }
    });
    const part = response.candidates?.[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
};

// --- AUDIO/LIVE API ---

export const transcribeAudio = async (base64Audio: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [{ inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } }, { text: "Transcribe exactamente este reporte de audio." }]
        }
    });
    return response.text;
};
