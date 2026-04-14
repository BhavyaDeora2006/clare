// src/controllers/upload.controller.js

import { uploadPdfService } from "../services/upload.service.js";

export const uploadPdf = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "PDF required" });
    }

    const result = await uploadPdfService(file.buffer);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};