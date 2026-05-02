import { supabase } from "../config/supabase.js";

export const deleteUserAccount = async (userId) => {
  try {
    // =========================
    // 🧠 1. FLASHCARDS (via decks)
    // =========================
    const { data: decks } = await supabase
      .from("decks")
      .select("id")
      .eq("user_id", userId);

    const deckIds = decks?.map(d => d.id) || [];

    if (deckIds.length) {
      await supabase
        .from("flashcards")
        .delete()
        .in("deck_id", deckIds);
    }

    await supabase.from("decks").delete().eq("user_id", userId);


    // =========================
    // 🧪 3. REFINE SYSTEM
    // =========================
    const { data: refineDecks } = await supabase
      .from("refine_decks")
      .select("id")
      .eq("user_id", userId);

    const refineDeckIds = refineDecks?.map(d => d.id) || [];

    let quizIds = [];

    if (refineDeckIds.length) {
      const { data: quizzes } = await supabase
        .from("refine_quizzes")
        .select("id")
        .in("refine_deck_id", refineDeckIds);

      quizIds = quizzes?.map(q => q.id) || [];
    }

    if (quizIds.length) {
      await supabase
        .from("refine_responses")
        .delete()
        .in("quiz_id", quizIds);
    }

    if (refineDeckIds.length) {
      await supabase
        .from("refine_quizzes")
        .delete()
        .in("refine_deck_id", refineDeckIds);
    }

    await supabase.from("refine_decks").delete().eq("user_id", userId);

    // =========================
    // 🧠 4. LEARNING CORE
    // =========================
    await supabase.from("learning_paths").delete().eq("user_id", userId);
    await supabase.from("study_intents").delete().eq("user_id", userId);

    // =========================
    // ⚙️ 5. USER META
    // =========================
    await supabase.from("user_preferences").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    // =========================
    // 🔥 6. AUTH DELETE
    // =========================
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    return { success: true };

  } catch (err) {
    console.error("Delete error:", err);
    throw new Error(err.message);
  }
};