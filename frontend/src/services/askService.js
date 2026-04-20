import apiClient from "./apiClient";


/**
 * Upload a PDF document to the backend for RAG processing.
 * Uses the /upload endpoint (no auth required, multipart form data).
 * Returns { documentId, reused }.
 */
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await apiClient.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * Send a question to the backend AI and return a formatted chat response.
 * Uses the dedicated /ask endpoint with RAG-based retrieval.
 * Requires a documentId from a prior upload.
 */
export const askQuestion = async (question, documentId) => {
  const res = await apiClient.post("/ask", { question, documentId });
  return res.data;
};

/**
 * Extract a chat-friendly message from the ask response.
 * Maps the { answer, sources } response into { content, sources } for MessageBubble.
 */
export const formatAiResponse = (data) => {
  if (!data || !data.answer) {
    return { role: "ai", content: "I received your question but couldn't generate a response." };
  }

  // Map sources into reference-friendly format
  const sources = (data.sources || []).map((s) => ({
    title: `Page ${s.page}`,
    description: s.snippet,
  }));

  return {
    role: "ai",
    content: data.answer,
    sources,
  };
};
