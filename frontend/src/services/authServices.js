import { supabase } from "./supabaseClient"

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

// Logout
export const signOut = async () => {
    return await supabase.auth.signOut()
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