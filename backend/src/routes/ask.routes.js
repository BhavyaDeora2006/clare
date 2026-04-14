// src/routes/ask.routes.js

import express from "express";
import { askQuestion } from "../controllers/ask.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authRequired, askQuestion);

export default router;