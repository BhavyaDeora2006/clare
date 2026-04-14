// src/services/retrieval.service.js

import { supabase } from "../config/supabase.js";

export const getRelevantChunks = async (queryEmbedding, matchCount = 4) => {
  try {
    const { data, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Retrieval Error:", error);
    throw new Error("Failed to retrieve relevant chunks");
  }
};