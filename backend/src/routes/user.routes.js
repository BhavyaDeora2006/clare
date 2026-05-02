import express from "express";
import { handleDeleteAccount } from "../controllers/user.controller.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = express.Router();

router.delete("/delete-account", authRequired, handleDeleteAccount);

export default router;