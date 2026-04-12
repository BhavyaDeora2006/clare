import express from "express";
import {
  getDecksController,
  getCardsController,
  createDeckController,
  createCardController,
  updateDeckController,
  deleteDeckController,
  updateCardController,
  deleteCardController,
  getDeckSession
} from "../controllers/echo.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/deck/:deckId", getDeckSession);
router.get("/decks", authRequired, getDecksController);
router.post("/decks", authRequired, createDeckController);

router.put("/decks", authRequired, updateDeckController);
router.delete("/decks/:deckId", authRequired, deleteDeckController);

router.get("/cards/:deckId", authRequired, getCardsController);
router.post("/cards", authRequired, createCardController);

router.put("/cards", authRequired, updateCardController);
router.delete("/cards/:cardId", authRequired, deleteCardController);

export default router;