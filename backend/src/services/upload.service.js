// src/services/upload.service.js

import { processPdfForAsk } from "./pdf.service.js";
import { generateEmbedding } from "./embedding.service.js";
import { supabase } from "../config/supabase.js";
import { generateHash } from "./hash.service.js";

export const uploadPdfService = async (buffer) => {
  // 1. hash
  const pdfHash = generateHash(buffer);

  // 2. check existing
  const { data: existing } = await supabase
    .from("documents")
    .select("*")
    .eq("pdf_hash", pdfHash)
    .single();

  if (existing) {
    return { documentId: existing.id, reused: true };
  }

  // 3. process PDF → chunks
  const chunks = await processPdfForAsk(buffer);

  // 4. create document
  const { data: doc } = await supabase
    .from("documents")
    .insert({ pdf_hash: pdfHash })
    .select()
    .single();

  // 5. embed + store
  const records = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i].content);

    records.push({
      document_id: doc.id,
      content: chunks[i].content,
      embedding,
      page_number: chunks[i].page_number,
    });
  }

  await supabase.from("document_chunks").insert(records);

  return { documentId: doc.id, reused: false };
};