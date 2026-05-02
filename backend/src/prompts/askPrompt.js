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
- Use examples if helpful
- Answer ONLY from context
- If not found, say: "Not found in the document"

Answer:
`;
};