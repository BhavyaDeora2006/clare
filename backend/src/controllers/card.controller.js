import { supabase } from "../config/supabase.js";

export const updateCardFeedback = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body; // 0–4

  try {
    // 🔹 1. Fetch current card
    const { data: card, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // 🔹 2. Extract previous values
    const prevAvg = card.avg_score || 0;
    const prevCount = card.review_count || 0;
    const prevInterval = card.interval || 1;

    const newCount = prevCount + 1;

    // 🧠 Running average
    const newAvg =
      (prevAvg * prevCount + score) / newCount;

    // 🌊 Interval update (hybrid logic)
    let newInterval;

    if (score <= 1) {
      // ❌ weak recall → reset
      newInterval = 1;
    } else if (score === 2) {
      newInterval = prevInterval * 1.2;
    } else if (score === 3) {
      newInterval = prevInterval * 2;
    } else {
      newInterval = prevInterval * 2.5;
    }

    // ⏳ Next review date
    const now = new Date();
    const nextReviewAt = new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000
    );

    // 🔹 3. Update DB
    const { data: updated, error: updateError } =
      await supabase
        .from("flashcards")
        .update({
          avg_score: newAvg,
          review_count: newCount,
          last_score: score,
          last_reviewed: now,
          interval: newInterval,
          next_review_at: nextReviewAt,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};