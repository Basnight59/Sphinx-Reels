import { GoogleGenAI, Type } from "@google/genai";
import { Scene, AIScriptType } from "../types";

const apiKey = process.env.API_KEY || '';
// Note: In a real production app, never expose API keys on the client.
// This should be proxied through a backend. 
// For this demo, we assume the environment variable is injected or the user provides it (simulated).

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateScenesFromTopic = async (topic: string, type: AIScriptType): Promise<Scene[]> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock data.");
    return mockGenerate(topic);
  }

  try {
    const prompt = `
      Create a script for a short vertical video (Reel/TikTok) about "${topic}".
      The style should be ${type}.
      Generate exactly 3 to 5 scenes.
      For each scene, provide a short narration text (max 20 words) and an estimated duration.
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The narration text for the scene" },
              duration: { type: Type.NUMBER, description: "Duration in seconds" },
              visualDescription: { type: Type.STRING, description: "A short description of the visual for image generation search" }
            },
            required: ["text", "duration", "visualDescription"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    const parsedData = JSON.parse(jsonText) as { text: string, duration: number, visualDescription: string }[];

    return parsedData.map((item, index) => ({
      id: `gen-${Date.now()}-${index}`,
      text: item.text,
      duration: item.duration,
      image: `https://picsum.photos/seed/${encodeURIComponent(item.visualDescription.slice(0, 10))}/1080/1920`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockGenerate(topic);
  }
};

// Fallback for when API key is missing or fails
const mockGenerate = (topic: string): Scene[] => {
  return [
    {
      id: `mock-1`,
      text: `Here is a fascinating fact about ${topic}.`,
      duration: 4,
      image: `https://picsum.photos/seed/${topic}1/1080/1920`
    },
    {
      id: `mock-2`,
      text: `Did you know that it changes everything?`,
      duration: 3,
      image: `https://picsum.photos/seed/${topic}2/1080/1920`
    },
    {
      id: `mock-3`,
      text: `Follow for more insights on ${topic}.`,
      duration: 3,
      image: `https://picsum.photos/seed/${topic}3/1080/1920`
    }
  ];
};