import { GoogleGenAI } from "@google/genai";
import { BaziData } from "../lib/baziUtils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeBazi(data: BaziData, name?: string) {
  const personalization = name ? `名为“${name}”的` : '';
  const prompt = `
    作为一名精通中国传统命理八字（四柱预测学）的大师，请根据以下八字排盘为这位${personalization}缘主进行深度解析。
    风格：极简、直观、富有禅意、见解深刻。
    
    八字排盘：
    年柱：${data.yearPillar.heavenlyStem}${data.yearPillar.earthlyBranch}
    月柱：${data.monthPillar.heavenlyStem}${data.monthPillar.earthlyBranch}
    日柱：${data.dayPillar.heavenlyStem}${data.dayPillar.earthlyBranch}
    时柱：${data.hourPillar.heavenlyStem}${data.hourPillar.earthlyBranch}
    
    阳历日期：${data.solarDate}
    阴历日期：${data.lunarDate}
    
    请从以下几个维度进行解析（使用 Markdown 格式）：
    1. **本命核心**：简述性格特质与五行喜忌。
    2. **事业财富**：职业方向建议与财富格局。
    3. **情感人际**：人机关系特点。
    4. **流年建议**：当下及近期的一句禅意建议。
    
    输出要求：
    - 如果提供了姓名，请在解析中适当提及，增加亲切感。
    - 语言优美，富有哲学气息。
    - 避免迷信化的词汇，更多侧重于心理引导与人生定向。
    - 每段话不要太长。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "解析过程中星云变幻，暂时无法获取。请稍后再试。";
  }
}
