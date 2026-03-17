import { supabase } from "./supabaseClient"

// CREATE
export const createIntent = async (title, description) => {
    const { data: userData } = await supabase.auth.getUser()

    return await supabase
        .from("study_intents")
        .insert([
            {
                user_id: userData.user.id,
                title,
                description
            }
        ])
}

// READ
export const getIntents = async () => {
    return await supabase.from("study_intents").select("*")
}

// UPDATE
export const updateIntent = async (id, title, description) => {
    return await supabase
        .from("study_intents")
        .update({ title, description })
        .eq("id", id)
}

// DELETE
export const deleteIntent = async (id) => {
    return await supabase
        .from("study_intents")
        .delete()
        .eq("id", id)
}