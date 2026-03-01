import express from "express"
import { verifyUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/secure-data", verifyUser, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user.email
  })
})

export default router