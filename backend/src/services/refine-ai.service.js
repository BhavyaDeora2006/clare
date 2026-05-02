import { groq } from "../config/groq.js";
import { questPrompt } from "../prompts/questPrompt.js";

export const generateQuiz = async (text, userId) => {
  console.log("UPLOAD CONTROLLER HIT");
  try {
    console.log("GEN QUIZ START");

    const prompt = await questPrompt(text, userId);
    console.log("PROMPT BUILT");

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("AI RESPONSE RECEIVED");

    const content = response.choices[0].message.content;

// 🔹 Step 1: extract JSON safely
const jsonMatch = content.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  console.error("AI RAW RESPONSE:", content);
  throw new Error("No valid JSON found");
}

// 🔹 Step 2: parse only the JSON part
const cleanContent = jsonMatch[0];

return JSON.parse(cleanContent);

  } catch (err) {
    console.error("GENERATE QUIZ ERROR:", err);
    throw err; // let controller handle
  }
};