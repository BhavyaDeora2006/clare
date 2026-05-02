import express from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import {
  generateLearningPath,
  getAllLearningPaths,
  getLearningPath,
  updateProgress,
  toggleTopicCompletion,
} from "../controllers/learning.controller.js";

const router = express.Router();
router.post("/learning/generate", authRequired, generateLearningPath);
router.get("/learning", authRequired, getAllLearningPaths);
router.get("/learning/:id", authRequired, getLearningPath);
router.post("/learning/:id/progress", authRequired, updateProgress);
router.post("/learning/:id/toggle", authRequired, toggleTopicCompletion);
export default router;

