import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient"; // adjust path if needed

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  // 🌱 Existing preferences state
  const [prefs, setPrefs] = useState({
    theme: "light",
    accent: "sage",
    reduce_motion: false,
    auto_play: true,
    auto_expand: true,
    show_percent: true,
    explanation_style: "guided",
    session_closure: "soft",
    clarification_style: "guided-c",
    memory_reinforcement: "suggested",
  });

  // 🌱 Avatar state (KEEPING your architecture)
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      await fetchPreferences(user.id);
    }

    setLoading(false);
  };

  init();
}, []);

  // 🌊 Fetch preferences + avatar on load
  const fetchPreferences = async (userId) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setPrefs(data);
      }

      // 🔽 Fetch avatar
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (profile?.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }

    } catch (err) {
      console.error("Fetch preferences error:", err);
    }
  };

  // 🌊 Save preferences
  const savePreferences = async (updatedPrefs) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          ...updatedPrefs,
        },{ onConflict: "user_id" });

      if (error) throw error;

      setPrefs(updatedPrefs);
    } catch (err) {
      console.error("Save preferences error:", err);
      throw err;
    }
  };

  // 🌊 Upload avatar (FULL FLOW)
  const uploadAvatar = async (file) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!file || !user) return null;

      const filePath = `${user.id}/${Date.now()}`;

      // upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // get public URL
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // save in DB
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // update UI instantly
      setAvatarPreview(publicUrl);

      return publicUrl;

    } catch (err) {
      console.error("Avatar upload error:", err);
      return null;
    }
  };

  // 🌊 optional: direct setter (for preview before upload)
  const previewAvatar = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  return (
    <PreferencesContext.Provider
      value={{
        prefs,
        setPrefs,
        savePreferences,
        fetchPreferences,

        avatarPreview,
        setAvatarPreview,
        uploadAvatar,
        previewAvatar,

        loading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  return useContext(PreferencesContext);
};