import { getPreferenceModifiers } from "../services/getPreferenceModifier.js";

export const questPrompt = async (content, userId) => {
  const prefsModifier = await getPreferenceModifiers(userId);

  return `
You are an AI that generates quizzes STRICTLY from given content.

${prefsModifier}

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

${prefsModifier.includes("deep understanding")
  ? "Generate more conceptual and reasoning-based questions."
  : "Keep questions clear and straightforward."}

CONTENT:
"""
${content}
"""
`;
};