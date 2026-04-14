// src/controllers/ask.controller.js

import { askQuestionService } from "../services/ask.service.js";

export const askQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await askQuestionService({ question, documentId });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Ask Controller Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};