import { getPreferenceModifiers } from "../services/getPreferenceModifier.js";

export const buildAskPrompt = async (contextChunks, question, userId) => {
  // 🔹 fetch preferences
  const prefsModifier = await getPreferenceModifiers(userId);

  const context = contextChunks
    .map((chunk, i) => `(${i + 1}) ${chunk.content}`)
    .join("\n\n");

  return `
You are a helpful tutor.

${prefsModifier}

Use the context below to answer the question.

Context:
${context}

Question:
${question}

Instructions:
- Explain in simple terms
- Be clear and structured
- Answer ONLY from the given context
- If not found, say: "Not found in the document"

FORMAT RULES (STRICT):
- Limit total response to 120–150 words maximum
- Use at most 4–5 bullet points OR short paragraphs
- Each point must be concise (1–2 lines only)
- Avoid long explanations or repetition
- Do NOT exceed the limit even if more info exists

STYLE:
- Prioritize clarity over completeness
- Give only the most important information
- End with a 1-line summary if possible

Answer:
`;
};