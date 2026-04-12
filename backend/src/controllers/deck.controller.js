import { supabase } from "../config/supabase.js";

// =========================
// 📚 GET DECKS
// =========================
export const getDecks = async (req, res) => {
try {
const userId = req.user.id;

const { data, error } = await supabase
  .from("refine_decks")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

if (error) throw error;

res.json(data);


} catch (err) {
console.error("GET DECKS ERROR:", err);
res.status(500).json({ error: "Failed to fetch decks" });
}
};

// =========================
// ➕ CREATE DECK
// =========================
export const createDeck = async (req, res) => {
try {
const userId = req.user.id;
const { title } = req.body;


const { data, error } = await supabase
  .from("refine_decks")
  .insert({
    user_id: userId,
    title,
  })
  .select()
  .single();

if (error) throw error;

res.json(data);


} catch (err) {
console.error("CREATE DECK ERROR:", err);
res.status(500).json({ error: "Failed to create deck" });
}
};

// =========================
// ✏️ RENAME DECK
// =========================
export const renameDeck = async (req, res) => {
try {
const userId = req.user.id;
const { id } = req.params;
const { title } = req.body;

const { data, error } = await supabase
  .from("refine_decks")
  .update({ title })
  .eq("id", id)
  .eq("user_id", userId)
  .select()
  .single();

if (error) throw error;

res.json(data);


} catch (err) {
console.error("RENAME DECK ERROR:", err);
res.status(500).json({ error: "Failed to rename deck" });
}
};

// =========================
// 🗑️ DELETE DECK
// =========================
export const deleteDeck = async (req, res) => {
try {
const userId = req.user.id;
const { id } = req.params;

const { error } = await supabase
  .from("refine_decks")
  .delete()
  .eq("id", id)
  .eq("user_id", userId);

if (error) throw error;

res.json({ success: true });

} catch (err) {
console.error("DELETE DECK ERROR:", err);
res.status(500).json({ error: "Failed to delete deck" });
}
};
