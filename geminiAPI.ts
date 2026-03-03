import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateContent = async (prompt: string, systemInstruction: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        const text = response.text;

        if (text) {
            return text;
        } else {
            console.error("Gemini API response missing text:", response);
            return "Error: No se pudo generar una respuesta. Inténtalo de nuevo.";
        }
    } catch (e) {
        console.error("API Call Error:", e);
        return "Error en la conexión con la API de análisis estratégico. Por favor, verifica tu conexión.";
    }
};

export const generateChatContent = async (history: ChatMessage[]): Promise<string> => {
    const systemInstruction = "Eres 'Analista Táctico', un chatbot experto en la analogía del 'Ajedrez Criminal'. Tu propósito es responder preguntas sobre los roles, estrategias y conceptos presentados en la aplicación. Mantén un tono profesional, analítico y enigmático. No te desvíes del tema del análisis estratégico criminal y el ajedrez. Tus respuestas deben ser concisas y directas.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: history,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        const text = response.text;

        if (text) {
            return text;
        } else {
            console.error("Gemini API response missing text:", response);
            return "Error: No se pudo generar una respuesta. La respuesta de la API era inválida.";
        }
    } catch (e) {
        console.error("API Call Error:", e);
        return "Error en la conexión con la API. Por favor, verifica tu conexión e inténtalo de nuevo.";
    }
};
