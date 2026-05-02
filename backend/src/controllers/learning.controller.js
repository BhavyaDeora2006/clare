// src/controllers/learningPath.controller.js

import { supabase } from "../config/supabase.js";
import { groq } from "../config/groq.js";
import { buildPrompt } from "../prompts/buildPrompt.js";

// 🧠 Helper: Safe JSON extraction
const extractJSON = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) return null;

  const jsonString = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch {
    try {
      const fixed = jsonString
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
};

// 🧠 Generate Learning Path
export const generateLearningPath = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { intent } = req.body;

    // 🛡️ Input validation
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!intent || intent.trim().length < 5) {
      return res.status(400).json({ error: "Invalid intent" });
    }

    console.log("📥 Incoming intent:", intent);

    // 🔮 AI call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: await buildPrompt(intent, user_id),
        },
      ],
      temperature: 0.7,
    });

    let aiResponse = completion.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    console.log("\n🧠 RAW AI RESPONSE:\n", aiResponse);

    // 🧹 Clean markdown
    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🧠 Extract JSON safely
    const parsed = extractJSON(aiResponse);

    if (!parsed) {
      console.error("❌ Failed to extract JSON");
      return res.status(500).json({ error: "AI JSON parsing failed" });
    }

    // 🛡️ Structure validation
    if (!Array.isArray(parsed.chapters) || parsed.chapters.length === 0) {
      return res.status(500).json({ error: "Invalid chapters structure" });
    }

    if (!parsed.chapters[0]?.topics?.length) {
      return res.status(500).json({ error: "Invalid topics structure" });
    }

    const structure = {
      chapters: parsed.chapters,
    };

    const content = parsed.content || {};

    // 💾 Save to DB
    const { data, error } = await supabase
      .from("learning_paths")
      .insert([
        {
          user_id,
          intent,
          title: parsed.title || intent.slice(0, 40),
          structure,
          content,
          current_chapter_id: parsed.chapters[0].id,
          current_topic_id: parsed.chapters[0].topics[0].id,
          progress: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Learning path saved");

    return res.status(200).json({
      message: "Learning path created",
      learningPath: data,
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
};

// 📋 Get All Learning Paths for User
export const getAllLearningPaths = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning paths" });
  }
};

// 📥 Get Learning Path
export const getLearningPath = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { id } = req.params;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("id", id)
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    return res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch learning path" });
  }
};

// 🔄 Update Progress (current position)
export const updateProgress = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { id } = req.params;
    const { topicId, chapterId } = req.body;

    if (!topicId || !chapterId) {
      return res.status(400).json({ error: "topicId and chapterId required" });
    }

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

// ✅ Toggle Topic Completion
export const toggleTopicCompletion = async (req, res) => {
  try {
    const user_id = req.user?.id;
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

    if (error || !data) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    // 🛡️ Deep clone before mutation
    let structure = JSON.parse(JSON.stringify(data.structure));

    let found = false;

    structure.chapters.forEach((ch) => {
      ch.topics.forEach((t) => {
        if (t.id === topicId) {
          t.completed = !t.completed;
          found = true;
        }
      });
    });

    if (!found) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // 🧠 Progress calculation
    const totalTopics = structure.chapters.reduce(
      (acc, ch) => acc + ch.topics.length,
      0
    );

    const completedTopics = structure.chapters.reduce(
      (acc, ch) => acc + ch.topics.filter((t) => t.completed).length,
      0
    );

    const progress =
      totalTopics === 0
        ? 0
        : Math.round((completedTopics / totalTopics) * 100);

    // 💾 Update DB
    const { error: updateError } = await supabase
      .from("learning_paths")
      .update({ structure, progress })
      .eq("id", id)
      .eq("user_id", user_id);

    if (updateError) throw updateError;

    return res.json({ success: true, structure, progress });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Toggle failed" });
  }
};