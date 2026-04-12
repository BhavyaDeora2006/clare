import express from "express";
import multer from "multer";

import { authRequired } from "../middleware/auth.middleware.js";
import { uploadNotesController } from "../controllers/refine.controller.js";

import {
getDecks,
createDeck,
renameDeck,
deleteDeck,
} from "../controllers/deck.controller.js";

import {
    deleteQuizController,
    getAllQuizzes,
    getQuizResponses,
getQuizzesByDeck,
updateQuizTitleController,
} from "../controllers/quiz.controller.js";
import { submitAttempt } from "../controllers/quiz.controller.js";

const router = express.Router();
const upload = multer();

// =========================
// 📦 UPLOAD (AI)
// =========================
router.post(
"/upload",
authRequired,
upload.single("file"),
uploadNotesController
);

// =========================
// 📚 DECK ROUTES
// =========================
router.get("/decks", authRequired, getDecks);
router.post("/decks", authRequired, createDeck);
router.put("/decks/:id", authRequired, renameDeck);
router.delete("/decks/:id", authRequired, deleteDeck);
router.get("/responses/:quizId", authRequired, getQuizResponses);
// =========================
// 📄 QUIZ ROUTES
// =========================
router.get("/quizzes/:deckId", authRequired, getQuizzesByDeck);
router.post("/attempt", authRequired, submitAttempt);
router.get("/quizzes", authRequired, getAllQuizzes);
router.delete("/quiz/:id", authRequired, deleteQuizController);
router.put("/quiz/:id", authRequired, updateQuizTitleController);
export default router;
