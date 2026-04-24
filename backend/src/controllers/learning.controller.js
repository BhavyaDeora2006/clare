import { supabase } from "../config/supabase.js";
import { groq } from "../config/groq.js";
import { buildPrompt } from "../prompts/buildPrompt.js";

export const generateLearningPath = async (req, res) => {

  try {
    const user_id = req.user.id;
    const { intent } = req.body;

    console.log("📥 Incoming intent:", intent);

    // 🔮 Call Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: buildPrompt(intent),
        },
      ],
      temperature: 0.7,
    });

    let aiResponse = completion.choices[0].message.content;

  
    console.log("\n🧠 RAW AI RESPONSE:\n");
    console.log(aiResponse);
    console.log("\n-----------------------------\n");

    // remove markdown wrappers
    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // extract JSON safely
    const start = aiResponse.indexOf("{");
    const end = aiResponse.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("❌ No JSON found in AI response");
      return res.status(500).json({
        error: "Invalid AI response format",
      });
    }

    const jsonString = aiResponse.slice(start, end + 1);

  let parsed;

try {
  parsed = JSON.parse(jsonString);
} catch (err) {
  console.warn("⚠️ First parse failed, attempting repair...");

  try {
    // basic fixes
    const fixed = jsonString
      .replace(/,\s*}/g, "}")   // remove trailing commas
      .replace(/,\s*]/g, "]");

    parsed = JSON.parse(fixed);
  } catch (err2) {
    console.error("❌ JSON PARSE FAILED:\n", jsonString);
    return res.status(500).json({
      error: "AI JSON parsing failed",
    });
  }
}

    // 🛡️ Validate structure
    if (!parsed.chapters || !Array.isArray(parsed.chapters)) {
      console.error("❌ Invalid structure from AI:", parsed);
      return res.status(500).json({
        error: "AI did not return valid chapters",
      });
    }
    if (!parsed.content) {
  console.warn("⚠️ AI did not return content, using empty object");
}

    const structure = {
      chapters: parsed.chapters,
    };
    const content = parsed.content || {};

    // Save to Supabase
    const { data, error } = await supabase
      .from("learning_paths")
      .insert([
        {
          user_id,
          intent,
          title: parsed.title || intent.slice(0, 40),
          structure,
          content,
          current_chapter_id: parsed.chapters[0]?.id,
          current_topic_id: parsed.chapters[0]?.topics[0]?.id,
          progress: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Learning path saved successfully");

    return res.status(200).json({
      message: "AI learning path created",
      learningPath: data,
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);

    return res.status(500).json({
      error: "AI generation failed",
    });
  }
};

export const getLearningPath = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("id", id)
      .eq("user_id", user_id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning path" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { topicId, chapterId } = req.body;

    const { data, error } = await supabase
      .from("learning_paths")
      .update({
        current_topic_id: topicId,
        current_chapter_id: chapterId,
      })
      .eq("id", id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

export const toggleTopicCompletion = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { topicId } = req.body;
if (!topicId) {
  return res.status(400).json({ error: "topicId required" });
}
    const { data, error } = await supabase
      .from("learning_paths")
      .select("structure")
      .eq("id", id)
      .eq("user_id", user_id)
      .single();

    if (error) throw error;

    let structure = data.structure;

    // 🔁 toggle completion
    structure.chapters.forEach((ch) => {
      ch.topics.forEach((t) => {
        if (t.id === topicId) {
          t.completed = !t.completed;
        }
      });
    });

    // 🧠 calculate progress
    const totalTopics = structure.chapters.reduce(
      (acc, ch) => acc + ch.topics.length,
      0
    );

    const completedTopics = structure.chapters.reduce(
      (acc, ch) =>
        acc + ch.topics.filter((t) => t.completed).length,
      0
    );

    const progress = Math.round((completedTopics / totalTopics) * 100);

    // 💾 update DB
    const { error: updateError } = await supabase
      .from("learning_paths")
      .update({ structure, progress })   // 🔥 THIS LINE FIXES IT
      .eq("id", id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, structure, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Toggle failed" });
  }
};