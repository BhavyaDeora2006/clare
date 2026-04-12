import express from "express";
import { updateCardFeedback } from "../controllers/card.controller.js";

const router = express.Router();

// 🧠 Update memory based on feedback
router.post("/:id/feedback", updateCardFeedback);

export default router;