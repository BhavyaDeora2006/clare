import express from "express";
import { generateLearningPath } from "../controllers/learning.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/learning/generate", authRequired, generateLearningPath);

export default router;