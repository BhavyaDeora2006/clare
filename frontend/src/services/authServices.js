import { supabase } from "./supabaseClient"
import apiClient from "./apiClient"
// Sign Up
export const signUp = async (email, password) => {
    return await supabase.auth.signUp({
        email,
        password,
    })
}

// Login
export const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    })
}

// Logout (current device)
export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

// Logout (all devices)
export const signOutGlobal = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    return { error }
}

// Get current session
export const getSession = async () => {
    return await supabase.auth.getSession()
}

// Sign in with Google
export const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
    })
}

// Send password reset email
export const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })
}

// Update password (called after user clicks reset link)
export const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({
        password: newPassword,
    })
}

export const deleteAccount = async () => {
  const res = await apiClient.delete("/user/delete-account");
  return res.data;
};