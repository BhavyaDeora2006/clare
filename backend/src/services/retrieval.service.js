
import { supabase } from "../config/supabase.js";

export const getRelevantChunks = async (
  queryEmbedding,
  documentId,
  matchCount = 4
) => {
  try {
    const { data, error } = await supabase.rpc("match_chunks", {
      doc_id: documentId,            // 1st
      match_count: matchCount,       // 2nd
      query_embedding: queryEmbedding // 3rd
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Retrieval Error:", error);
    throw new Error("Failed to retrieve relevant chunks");
  }
};