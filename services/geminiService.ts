import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getMonsterTaunt = async (monsterName: string): Promise<string> => {
  const client = getClient();
  if (!client) return `${monsterName}咆哮著向你衝來！`;
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你係一隻名叫「${monsterName}」嘅遊戲怪獸，正在挑釁一位數學勇者。
      用廣東話口語寫一句短短嘅（20字內）嘲諷台詞。
      語氣要威嚇但有趣。只輸出台詞，唔好加引號或其他格式。`,
    });
    return response.text?.trim() || `${monsterName}咆哮著向你衝來！`;
  } catch {
    return `${monsterName}咆哮著向你衝來！`;
  }
};

export const getMathHint = async (question: string, wrongCount: number): Promise<string> => {
  const client = getClient();
  if (!client) return getLocalHint(question);
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `學生答唔到數學題：「${question}」，已經答錯${wrongCount}次。
      用廣東話口語、小學生明白嘅方法，30字內給一個具體計算提示。
      唔好直接說答案。只輸出提示文字。`,
    });
    return response.text?.trim() || getLocalHint(question);
  } catch {
    return getLocalHint(question);
  }
};

function getLocalHint(question: string): string {
  if (question.includes('×')) return '試下用手指數，或者一組一組咁加！';
  if (question.includes('+')) return '由大個數開始，再加細個數！';
  if (question.includes('-')) return '先數到大個數，再減返去細個數！';
  return '慢慢計，唔使急！';
}
