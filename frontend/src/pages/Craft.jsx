import { supabase } from "../services/supabaseClient"

const saveIntent = async () => {
  const { data, error } = await supabase
    .from("study_intents")
    .insert([
      {
        title: "Learn Recursion",
        description: "Understand base case and recursion tree",
        clarity_score: 7
      }
    ])

  if (error) console.log(error)
  else console.log("Saved", data)
}

const Craft = () => {
    saveIntent()
}

export default Craft;