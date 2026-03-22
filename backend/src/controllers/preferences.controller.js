import { supabase } from "../config/supabase.js";

export const getPreferences = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.json({});
    }
    console.error("error getting preferences", error)
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
};

export const updatePreferences = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  if (updates.id) delete updates.id;
  if (updates.user_id) delete updates.user_id;

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error("error updating preferences", error)
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
};