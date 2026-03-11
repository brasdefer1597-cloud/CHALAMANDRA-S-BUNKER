import type { Context } from "@netlify/functions";
import OpenAI from "openai";

const openai = new OpenAI();

interface RequestBody {
  action: "chat" | "analyze" | "counter-strategy" | "simulate";
  prompt?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
  pieceContext?: {
    name: string;
    criminalRole: string;
    description: string;
    criminalFunction: string;
    riskLevel: string;
  };
  tacticalContext?: {
    analyzedPieces: string[];
    globalRiskLevel: number;
    lastStrategy: string | null;
  };
}

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are the 'Tactical Analyst', an expert in the 'Criminal Chess' analogy. Maintain a professional, analytical, and enigmatic tone. Respond about roles and strategies. You speak with a 'Malandra Fresa' tone — street-smart but refined.`,

  analyze: `You are the Master Decoder. Tone: 'Malandra Fresa'. Analyze with extreme depth, no beating around the bush, street-smart but refined. Think step by step and provide deep tactical insights.`,

  "counter-strategy": `You are the Master Decoder. Tone: 'Malandra Fresa'. Provide criminal neutralization tactics using chess analogies. Be concise and lethal. Provide actionable counter-strategies.`,

  simulate: `You are the Bunker Intelligence. Your task is to predict the tactical response (the 'Counter-Move') of authorities or rivals to a proposed criminal move. Use chess analogies. Be detailed and strategic.`,
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body: RequestBody = await req.json();
    const { action } = body;

    if (!action || !SYSTEM_PROMPTS[action]) {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[action];
    let userContent = "";

    switch (action) {
      case "chat": {
        const messages: OpenAI.ChatCompletionMessageParam[] = [
          { role: "system", content: systemPrompt },
        ];

        if (body.messages && body.messages.length > 0) {
          for (const msg of body.messages) {
            messages.push({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content,
            });
          }
        }

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          max_tokens: 2048,
          temperature: 0.8,
        });

        return Response.json(
          { text: completion.choices[0]?.message?.content || "" },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      case "analyze": {
        userContent = body.prompt || "";
        break;
      }

      case "counter-strategy": {
        const piece = body.pieceContext;
        const tactical = body.tacticalContext;
        const contextInfo = tactical
          ? `\nPreviously analyzed targets: ${tactical.analyzedPieces.join(", ")}.\nGlobal Risk Level: ${tactical.globalRiskLevel}.`
          : "";

        userContent = piece
          ? `Analyze the archetype '${piece.criminalRole}' (based on the chess '${piece.name}').
Description: ${piece.description}.
Criminal function: ${piece.criminalFunction}.
Risk level: ${piece.riskLevel}.${contextInfo}

Provide a detailed neutralization plan or counter-strategy.`
          : body.prompt || "";
        break;
      }

      case "simulate": {
        userContent = `Simulate the counter-move of the authorities in response to this scenario: ${body.prompt}`;
        break;
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      max_tokens: 2048,
      temperature: 0.8,
    });

    return Response.json(
      { text: completion.choices[0]?.message?.content || "" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return Response.json(
      { error: error.message || "OpenAI API request failed" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const config = {
  path: "/api/openai-chat",
};
