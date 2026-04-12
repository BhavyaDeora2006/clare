import * as echoService from "../services/echo.service.js";
import { supabase } from "../config/supabase.js";
// GET /echo/decks
export const getDecksController = async (req, res) => {
  try {
    const userId = req.user.id;

    const decks = await echoService.getDecks(userId);

    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /echo/cards/:deckId
export const getCardsController = async (req, res) => {
  try {
    const { deckId } = req.params;

    const cards = await echoService.getCardsByDeck(deckId);

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /echo/decks
export const createDeckController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const deck = await echoService.createDeck(userId, title);

    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /echo/cards
export const createCardController = async (req, res) => {
  try {
    const { deckId, front, back } = req.body;

    const card = await echoService.createCard(deckId, front, back);

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDeckController = async (req, res) => {
  try {
    const { deckId, title } = req.body;
    const deck = await echoService.updateDeck(deckId, title);
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDeckController = async (req, res) => {
  try {
    const { deckId } = req.params;
    await echoService.deleteDeck(deckId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCardController = async (req, res) => {
  const { cardId, front, back } = req.body;
  const card = await echoService.updateCard(cardId, front, back);
  res.json(card);
};

export const deleteCardController = async (req, res) => {
  const { cardId } = req.params;
  await echoService.deleteCard(cardId);
  res.json({ success: true });
};



// ===============================
// 🧠 Echo Session (Sorting Logic)
// ===============================

const calculatePriority = (card) => {
  const now = Date.now();

  const last = card.last_reviewed
    ? new Date(card.last_reviewed).getTime()
    : now;

  const timeSince =
    (now - last) / (1000 * 60 * 60 * 24); // in days

  const interval = card.interval || 1;
  const avgScore = card.avg_score ?? 2;
  const reviewCount = card.review_count || 0;

  const forgettingFactor = Math.log(1 + timeSince / interval);
  const difficultyFactor = 5 - avgScore;
  const stability = 1 + reviewCount * avgScore;

  return (forgettingFactor * difficultyFactor) / stability;
};

export const getDeckSession = async (req, res) => {
  const { deckId } = req.params;

  try {
    const { data: cards, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await supabase
      .from("decks")
      .update({ last_reviewed: new Date() })
      .eq("id", deckId);

    // 🧠 sorting logic
    const sorted = cards
      .map((card) => ({
        ...card,
        priority: calculatePriority(card),
      }))
      .sort((a, b) => b.priority - a.priority);

    return res.json(sorted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};