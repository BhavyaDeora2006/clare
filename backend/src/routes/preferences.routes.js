// routes/preferences.routes.js
import express from "express";
import { getPreferences, updatePreferences } from "../controllers/preferences.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authRequired, getPreferences);
router.post("/", authRequired, updatePreferences);

export default router;