import express from "express"
import {
  getAllIntents,
  createIntent,
  updateIntent,
  deleteIntent
} from "../controllers/intent.controller.js"

const router = express.Router()

router.get("/", getAllIntents)
router.post("/", createIntent)
router.put("/:id", updateIntent)
router.delete("/:id", deleteIntent)

export default router