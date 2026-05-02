import { supabase } from "../config/supabase.js";

export const getPreferenceModifiers = async (userId) => {
  try {
    if (!userId) {
      console.warn("No userId, using default preferences");
      return defaultModifier();
    }

    const { data, error } = await supabase
      .from("user_preferences")
      .select("explanation_style, session_closure, clarification_style")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("PREF ERROR:", error);
      return defaultModifier();
    }

    const prefs = data || {
      explanation_style: "guided",
      session_closure: "soft",
      clarification_style: "guided",
    };

    const clean = (val) => val?.split("-")[0];

    const explanationMap = {
      straight: "Keep explanations short and direct.",
      guided: "Explain step-by-step with clarity.",
      conceptual: "Focus on deep understanding and connections.",
    };

    const closureMap = {
      open: "Do not include any summary.",
      soft: "End with a brief reflective summary.",
      structured: "End with a clear recap and key takeaways.",
    };

    const clarificationMap = {
      direct: "Answer directly without expansion.",
      guided: "Explain reasoning step-by-step.",
      exploratory: "Expand with deeper insights and related ideas.",
    };

    return `
USER PREFERENCES:
- Explanation Style: ${explanationMap[clean(prefs.explanation_style)]}
- Session Closure: ${closureMap[clean(prefs.session_closure)]}
- Clarification Style: ${clarificationMap[clean(prefs.clarification_style)]}
`;
  } catch (err) {
    console.error("PREF CRASH:", err);
    return defaultModifier();
  }
};

// 🔹 fallback (VERY IMPORTANT)
const defaultModifier = () => `
USER PREFERENCES:
- Explanation Style: Explain step-by-step with clarity.
- Session Closure: End with a brief reflective summary.
- Clarification Style: Explain reasoning step-by-step.
`;