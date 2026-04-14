// src/services/ask.service.js

import { generateEmbedding } from "./embedding.service.js";
import { getRelevantChunks } from "./retrieval.service.js";
import { buildAskPrompt } from "../prompts/askPrompt.js";
import { groq } from "../config/groq.js";

export const askQuestionService = async ({ question, documentId }) => {
  try {
    // 1. Generate embedding for question
    const queryEmbedding = await generateEmbedding(question);

    // 2. Retrieve relevant chunks
    const chunks = await getRelevantChunks(queryEmbedding,documentId, 4);

    // 3. Build prompt
    const prompt = buildAskPrompt(chunks, question);

    // 4. Call AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // 5. Format sources for frontend
    const sources = chunks.map((chunk) => ({
      page: chunk.page_number,
      snippet: chunk.content,
    }));

    return { answer, sources };
  } catch (error) {
    console.error("Ask Service Error:", error);
    throw new Error("Failed to process question");
  }
};