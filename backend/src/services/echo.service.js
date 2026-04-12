import { supabase } from "../config/supabase.js";

// GET DECKS
export const getDecks = async (userId) => {
  const { data, error } = await supabase
    .from("decks")
    .select(`
      id,
      title,
      last_reviewed,
      flashcards(count)
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    cards: d.flashcards[0].count,
    lastReviewed: d.last_reviewed,
  }));
};

// CREATE DECK
export const createDeck = async (userId, title) => {
  const { data, error } = await supabase
    .from("decks")
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// Update Deck
export const updateDeck = async (deckId, title) => {
  const { data, error } = await supabase
    .from("decks")
    .update({ title })
    .eq("id", deckId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete Deck
export const deleteDeck = async (deckId) => {
  const { error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId);

  if (error) throw error;
};


// GET CARDS
export const getCardsByDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("deck_id", deckId);

  if (error) throw error;

  return data;
};


// CREATE CARD
export const createCard = async (deckId, front, back) => {
  const { data, error } = await supabase
    .from("flashcards")
    .insert({ deck_id: deckId, front, back })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// UPDATE CARD
export const updateCard = async (cardId, front, back) => {
  const { data, error } = await supabase
    .from("flashcards")
    .update({ front, back })
    .eq("id", cardId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// DELETE CARD
export const deleteCard = async (cardId) => {
  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", cardId);

  if (error) throw error;
};