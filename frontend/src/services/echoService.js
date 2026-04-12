import apiClient from "./apiClient";

// 🔁 GET ALL DECKS
export const fetchDecks = async () => {
  const res = await apiClient.get("/echo/decks");
  return res.data;
};

// 🔁 GET CARDS BY DECK
export const fetchCards = async (deckId) => {
  const res = await apiClient.get(`/echo/cards/${deckId}`);
  return res.data;
};

// ➕ CREATE DECK
export const createDeck = async (title) => {
  const res = await apiClient.post("/echo/decks", { title });
  return res.data;
};

// ➕ CREATE CARD
export const createCard = async (deckId, front, back) => {
  const res = await apiClient.post("/echo/cards", {
    deckId,
    front,
    back,
  });
  return res.data;
};

export const updateDeck = async (deckId, title) => {
  const res = await apiClient.put("/echo/decks", {
    deckId,
    title,
  });
  return res.data;
};

export const deleteDeck = async (deckId) => {
  await apiClient.delete(`/echo/decks/${deckId}`);
};

export const updateCard = async (cardId, front, back) => {
  const res = await apiClient.put("/echo/cards", {
    cardId,
    front,
    back,
  });
  return res.data;
};

export const deleteCard = async (cardId) => {
  await apiClient.delete(`/echo/cards/${cardId}`);
};

export const fetchSessionCards = async (deckId) => {
  const res = await apiClient.get(`/echo/deck/${deckId}`);
  return res.data;
};