import { groq } from "../config/groq.js";

const buildPrompt = (content) => `
You are an AI that generates quizzes STRICTLY from given content.

RULES:
- Use ONLY the provided content
- Do NOT use outside knowledge
- Do NOT hallucinate
- If unsure, skip that part
- Return ONLY valid JSON

FORMAT:
{
  "title": "short topic title",
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correct_answer": "..."
    }
  ]
}

CONTENT:
"""
${content}
"""
`;

export const generateQuiz = async (text) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: buildPrompt(text),
      },
    ],
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("AI PARSE ERROR:", content);
    throw new Error("Invalid AI response format");
  }
};