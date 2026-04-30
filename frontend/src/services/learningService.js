import apiClient from "./apiClient";
import { supabase } from "./supabaseClient";

// List all paths — uses supabase directly (no new backend endpoint needed)
export const fetchAllPaths = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchPath = async (id) => {
  const res = await apiClient.get(`/learning/${id}`);
  return res.data;
};

export const toggleTopic = async (pathId, topicId) => {
  const res = await apiClient.post(`/learning/${pathId}/toggle`, { topicId });
  return res.data;
};

export const updatePathProgress = async (pathId, topicId, chapterId) => {
  const res = await apiClient.post(`/learning/${pathId}/progress`, { topicId, chapterId });
  return res.data;
};
