// src/prompts/askPrompt.js

export const buildAskPrompt = (contextChunks, question) => {
  const context = contextChunks
    .map((chunk, i) => `(${i + 1}) ${chunk.content}`)
    .join("\n\n");

  return `
You are an AI tutor answering ONLY from provided context.

Context:
${context}

Question:
${question}

Instructions:
- Answer clearly and simply
- Use only the given context
- If answer not found, say "Not found in the provided material"
- Do not hallucinate

Return only the answer.
`;
};