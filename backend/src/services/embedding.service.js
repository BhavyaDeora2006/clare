// src/services/embedding.service.js

import { groq } from "../config/groq.js";

export const generateEmbedding = async (text) => {
  try {
    const response = await groq.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw new Error("Failed to generate embedding");
  }
};