import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getExplanation = async (a: number, b: number): Promise<string> => {
  const client = getClient();
  if (!client) return "請檢查 API Key 設定。";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the multiplication of ${a} x ${b} to a 7-year-old child who is struggling with it. 
      Use a fun, visual metaphor (like grouping candies, apples, or toys).
      Keep it short (under 40 words).
      Reply in Traditional Chinese (Cantonese colloquial style preferred).
      Start with "試下咁諗："`,
    });
    return response.text || "試下用手指數下？";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "小老師暫時休息緊，試下自己畫圖？";
  }
};

export const getEncouragement = async (streak: number): Promise<string> => {
  const client = getClient();
  if (!client) return "做得好！";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a very short, high-energy encouragement message for a child who just got a streak of ${streak} correct answers in a math game.
      Space adventure theme.
      Reply in Traditional Chinese.`,
    });
    return response.text || "太厲害喇！";
  } catch (error) {
    return "太厲害喇！";
  }
};

export const getWordProblem = async (difficulty: string): Promise<{ question: string; a: number; b: number }> => {
  const client = getClient();
  // Fallback defaults if API fails
  const fallback = { question: "有 3 隻貓，每隻貓有 4 條腿，總共有幾多條腿？", a: 3, b: 4 };

  if (!client) return fallback;

  let range = "1 to 9";
  if (difficulty === 'EASY') range = "1 to 5";
  if (difficulty === 'HARD') range = "2 to 12";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a simple multiplication word problem for a child.
      Pick two random numbers (Factors A and B) between ${range}.
      The story should be about space, aliens, or cute animals.
      Output ONLY a JSON object: { "question": "The question text in Traditional Chinese", "a": number, "b": number }.
      Do not add markdown formatting like \`\`\`json.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim();
    if (!text) return fallback;
    
    // Simple sanitization in case markdown slips in
    const cleanJson = text.replace(/```json|```/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Word Problem Error:", error);
    return fallback;
  }
};