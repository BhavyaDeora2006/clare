import { supabase } from "../config/supabase.js";

// =========================
// 📄 GET QUIZZES BY DECK
// =========================
export const getQuizzesByDeck = async (req, res) => {
try {
const userId = req.user.id;
const { deckId } = req.params;

const { data, error } = await supabase
  .from("refine_quizzes")
  .select("*")
  .eq("deck_id", deckId)
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

if (error) throw error;

res.json(data);


} catch (err) {
console.error("GET QUIZZES ERROR:", err);
res.status(500).json({ error: "Failed to fetch quizzes" });
}
};

export const getQuizResponses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    // 🔍 fetch responses
    const { data, error } = await supabase
      .from("refine_responses")
      .select("*")
      .eq("quiz_id", quizId)
      .order("question_index", { ascending: true });

    if (error) throw error;

    // 🧠 format for frontend
    const formatted = data.map((r) => ({
      question_text: r.question_text,
      options: r.options_json,
      correct_answer: r.correct_answer,
      user_answer: r.user_answer,
      is_correct: r.is_correct,
    }));

    res.json(formatted);

  } catch (err) {
    console.error("GET RESPONSES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("refine_quizzes")
      .select("id, deck_id, created_at")
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, responses } = req.body;

    // 🧹 delete previous attempt (only last attempt kept)
    await supabase
      .from("refine_responses")
      .delete()
      .eq("quiz_id", quizId);

    // 📊 build insert payload
    const formatted = responses.map((r, i) => ({
      quiz_id: quizId,
      question_index: i,
      question_text: r.question_text,
      options_json: r.options,
      correct_answer: r.correct_answer,
      user_answer: r.user_answer,
      is_correct: r.is_correct,
    }));

    const { error } = await supabase
      .from("refine_responses")
      .insert(formatted);

    if (error) throw error;

    // 📈 update quiz summary
    const score = responses.filter((r) => r.is_correct).length;

    await supabase
      .from("refine_quizzes")
      .update({
        score,
        last_attempted_at: new Date(),
      })
      .eq("id", quizId)
      .eq("user_id", userId);

    res.json({ success: true });

  } catch (err) {
    console.error("SUBMIT ATTEMPT ERROR:", err);
    res.status(500).json({ error: "Failed to store attempt" });
  }
};

export const deleteQuizController = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("refine_quizzes")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: "Delete failed" });
  }

  res.json({ success: true });
};

export const updateQuizTitleController = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const { data, error } = await supabase
    .from("refine_quizzes")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "Update failed" });
  }

  res.json(data);
};