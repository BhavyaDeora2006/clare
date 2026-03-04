import express from "express"
import { authRequired } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/secure-data", authRequired, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user.email
  })
})

export default router