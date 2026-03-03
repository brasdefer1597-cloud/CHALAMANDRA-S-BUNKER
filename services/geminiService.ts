
import { GoogleGenAI, Modality, Type, ThinkingLevel } from '@google/genai';
import { ChatMessage, ChessPiece, TacticalState } from '../types';

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
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
                systemInstruction: "You are the Master Decoder. Tone: 'Malandra Fresa'. Analyze with extreme depth, no beating around the bush, street-smart but refined."
            }
        });
        return response.text || "";
    } catch (e) {
        throw new GeminiServiceError("The bunker's brain is saturated. Retry the move.");
    }
};

export const fastResponse = async (prompt: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are the 'Tactical Quick-Response' unit. Be extremely fast, direct, and concise."
            }
        });
        return response.text || "";
    } catch (e) {
        return "System lag detected.";
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
            title: c.web?.title || "Link",
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
            title: c.maps?.title || "Location",
            uri: c.maps?.uri
        })) || []
    };
};

// FIX: Added generateCounterStrategy to handle piece-specific tactical analysis
export const generateCounterStrategy = async (piece: ChessPiece, tacticalState?: TacticalState): Promise<string> => {
    const ai = getAI();
    const context = tacticalState ? `\nPreviously analyzed targets: ${tacticalState.analyzedPieces.join(", ")}.\nGlobal Risk Level: ${tacticalState.globalRiskLevel}.` : "";
    const prompt = `Analyze the archetype '${piece.criminalRole}' (based on the chess '${piece.name}'). 
    Description: ${piece.description}. 
    Criminal function: ${piece.criminalFunction}. 
    Risk level: ${piece.riskLevel}.${context}
    
    Provide a detailed neutralization plan or counter-strategy.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are the Master Decoder. Tone: 'Malandra Fresa'. Provide criminal neutralization tactics using chess analogies. Be concise and lethal."
            }
        });
        return response.text || "Error in tactical analysis.";
    } catch (e) {
        throw new GeminiServiceError("Intelligence server failure.");
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
                parts: m.parts.map(p => {
                    if (p.text) return { text: p.text };
                    if (p.inlineData) return { inlineData: p.inlineData };
                    return { text: "" };
                })
            })),
            config: {
                systemInstruction: "You are the 'Tactical Analyst', an expert in the 'Criminal Chess' analogy. Maintain a professional, analytical, and enigmatic tone. Respond about roles and strategies."
            }
        });
        return response.text || "No tactical response.";
    } catch (e) {
        throw new GeminiServiceError("Connection lost with the Tactical Analyst.");
    }
};

// FIX: Added simulateScenario to handle strategic simulations
export const simulateScenario = async (scenario: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Simulate the counter-move of the authorities in response to this scenario: ${scenario}`,
            config: {
                systemInstruction: "You are the Bunker Intelligence. Your task is to predict the tactical response (the 'Counter-Move') of authorities or rivals to a proposed criminal move."
            }
        });
        return response.text || "Simulation failed.";
    } catch (e) {
        throw new GeminiServiceError("Error in the scenario simulator.");
    }
};

// --- MULTIMEDIA GENERATION ---

export const generateVideoVeo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Tactical bunker cinematic, Chalamandra style: ${prompt}`,
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
        contents: `High-level criminal iconography, fuchsia neon and acid green aesthetic: ${prompt}`,
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
                { text: `Modify this tactical image: ${prompt}` }
            ]
        }
    });
    const part = response.candidates?.[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
};

// --- AUDIO/LIVE API ---

export const transcribeAudio = async (base64Audio: string, mimeType: string = 'audio/webm') => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [{ inlineData: { data: base64Audio, mimeType } }, { text: "Transcribe this audio report exactly." }]
        }
    });
    return response.text;
};

export const analyzeMedia = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: `Analyze this tactical evidence/media: ${prompt}` }
                ]
            },
            config: {
                systemInstruction: "You are the Master Decoder. Analyze the provided document, image, or video as criminal evidence. Extract key names, locations, dates, and tactical implications."
            }
        });
        return response.text || "Analysis failed.";
    } catch (e) {
        throw new GeminiServiceError("Evidence analysis server failure.");
    }
};

export const generateSpeech = async (text: string, voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' = 'Zephyr') => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio ? `data:audio/wav;base64,${base64Audio}` : null;
};
