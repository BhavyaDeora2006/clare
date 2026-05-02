import { generateHash } from "../services/hash.service.js";
import { extractPdfText, cleanText } from "../services/pdf.service.js";
import { generateQuiz } from "../services/refine-ai.service.js";
import { supabase } from "../config/supabase.js";

export const uploadNotesController = async (req, res) => {
  try {
    const { deckId } = req.body;
    const fileBuffer = req.file.buffer;

    const user_id = req.user.id
    // 🔐 1. HASH
    console.log("STEP 1: file received");
    const hash = generateHash(fileBuffer);

    // 🔍 2. CHECK EXISTING QUIZ (FIXED: file_hash)
console.log("STEP 2: checking existing");
    const { data: existing } = await supabase
      .from("refine_quizzes")
      .select("*")
      .eq("file_hash", hash)
.eq("user_id", user_id)

  .eq("deck_id", deckId || null)
      .maybeSingle();

    if (existing) {
      return res.json({
        source: "cache",
        quiz: existing,
      });
    }

    // 📄 3. EXTRACT TEXT

console.log("STEP 3: extracting text");
    const rawText = await extractPdfText(fileBuffer);

    // 🧹 4. CLEAN TEXT
    const cleanedText = cleanText(rawText);
    console.log("TEXT SAMPLE:", cleanedText.slice(0, 200));

   // 🤖 5. GENERATE QUIZ

console.log("STEP 4: generating quiz");
const quizData = await generateQuiz(cleanedText, user_id);

const questions = quizData.questions || [];
console.log("STEP 5: quiz generated");
// 💾 6. STORE IN DB (PUT YOUR CODE HERE)
const { data: inserted, error } = await supabase
  .from("refine_quizzes")
  .insert({
    user_id,
    deck_id: deckId || null,
    title: quizData.title || "Generated Quiz",
    file_hash: hash,
    questions_json: questions,
    total_questions: questions.length,
  })
  .select()
  .single();

if (error) throw error;

// 📤 7. RETURN RESPONSE
return res.json({
  source: "generated",
  quiz: inserted,
});

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      error: "Failed to process PDF",
    });
  }
};