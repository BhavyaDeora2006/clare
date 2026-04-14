// src/services/embedding.service.js

import { pipeline } from '@xenova/transformers';

let extractor;

export const generateEmbedding = async (text) => {
  try {
    if (!extractor) {
      console.log("Loading embedding model...");
      extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
      console.log("Model loaded.");
    }

    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
};