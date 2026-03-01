import { supabase } from "../config/supabase.js"

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" })

  const token = authHeader.split(" ")[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user)
    return res.status(401).json({ message: "Invalid token" })

  req.user = data.user
  next()
}