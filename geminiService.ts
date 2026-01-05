
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CoPilotAnalysis } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are Aura, an AI-native consumer health co-pilot. You transform complex ingredient lists into human insight.

Core Directives:
1. INTENT INFERENCE: Start by inferring WHY the user is scanning this (e.g., metabolic health, child safety, food allergies, athletic performance). If you are unsure, provide your best guess but include a brief, natural language clarifying question.
2. DYNAMIC HIGHLIGHTING: Flag ingredients that specifically relate to the inferred intent as 'isPrimaryConcern: true'.
3. REASONING & TRADE-OFFS: Explain the 'why' behind ingredients. If an ingredient has benefits (preservation) but risks (health impact), explicitly detail this tradeoff.
4. HONEST UNCERTAINTY: Explicitly state what we don't know (e.g., "natural flavors" origin).
5. MINIMAL FRICTION CLARIFICATION: If the intent is ambiguous (e.g. could be for an infant OR a diabetic adult), ask ONE brief question like "Is this for a little one, or are we watching sugar for another reason?"

OUTPUT SCHEMA (Strict JSON):
{
  "inferredIntent": { "concern": string, "confidence": number, "reasoning": string },
  "overallNarrative": string,
  "insights": [
    { 
      "ingredient": string, 
      "impact": string, 
      "whyItMatters": string, 
      "tradeoff": string, 
      "isPrimaryConcern": boolean,
      "uncertainty": "Low" | "Medium" | "High",
      "uncertaintyReason": string
    }
  ],
  "clarifyingQuestions": string[], 
  "suggestedAction": string
}
`;

export async function analyzeIngredients(input: { text?: string; image?: string; additionalContext?: string }): Promise<CoPilotAnalysis> {
  const model = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.7,
    },
    contents: {
      parts: [
        ...(input.image ? [{ inlineData: { data: input.image.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        ...(input.text ? [{ text: `Ingredients: ${input.text}` }] : []),
        ...(input.additionalContext ? [{ text: `User clarification: ${input.additionalContext}` }] : []),
        { text: "Analyze this as my co-pilot. Focus on reasoning and trade-offs." }
      ]
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("No response from Aura.");
  
  try {
    return JSON.parse(text) as CoPilotAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", text);
    throw new Error("Aura had trouble processing that information.");
  }
}
