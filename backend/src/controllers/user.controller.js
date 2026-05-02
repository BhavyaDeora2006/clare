import { deleteUserAccount } from "../services/user.service.js";

export const handleDeleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware

    const result = await deleteUserAccount(userId);

    res.status(200).json(result);

  } catch (err) {
    console.error("Delete account error:", err);
    res.status(400).json({ error: err.message });
  }
};