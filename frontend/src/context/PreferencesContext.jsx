import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPreferences, updatePreferences } from "../services/preferencesService";
import { supabase } from "../services/supabaseClient";

/* ── Default values ── */
const defaultPrefs = {
  theme: "dark",
  accent: "sage",
  reduce_motion: false,
  auto_play: true,
  auto_expand: false,
  show_percent: true,
  explanation_style: "guided",
  session_closure: "soft",
  clarification_style: "guided-c",
  memory_reinforcement: "suggested",
};

const STORAGE_KEY = "clare_preferences";

/* ── Context ── */
const PreferencesContext = createContext(null);

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
};

/* ── Provider ── */
export const PreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(() => {
    // Hydrate from localStorage immediately to avoid flash
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });
  const [loaded, setLoaded] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("https://assets.leetcode.com/users/Bhavya_Deora/avatar_1772714696.png");

  /* ── Load from backend ── */
  const loadPreferences = useCallback(async () => {
    try {
      const data = await getPreferences();
      if (data && Object.keys(data).length > 0) {
        const merged = { ...defaultPrefs, ...data };
        setPrefs(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn("Preferences: using local/default values", err.message);
    } finally {
      setLoaded(true);
    }
  }, []);

  /* ── Load on auth ready ── */
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) loadPreferences();
      else setLoaded(true);
    };
    init();
  }, [loadPreferences]);

  /* ── Update a single field (local only, not persisted yet) ── */
  const updateField = useCallback((key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

  /* ── Save all to backend + localStorage ── */
  const savePreferences = useCallback(async (overridePrefs) => {
    const toSave = overridePrefs || prefs;
    try {
      await updatePreferences(toSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setPrefs(toSave);
    } catch (err) {
      // Persist to localStorage even if backend fails
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      console.error("Failed to save preferences to backend:", err.message);
    }
  }, [prefs]);

  /* ── Reset to defaults ── */
  const resetPreferences = useCallback(() => {
    setPrefs(defaultPrefs);
  }, []);

  /* ── Apply theme to <html> whenever it changes ── */
  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [prefs.theme]);

  const value = {
    prefs,
    loaded,
    defaultPrefs,
    updateField,
    savePreferences,
    loadPreferences,
    resetPreferences,
    avatarPreview,
    setAvatarPreview,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
