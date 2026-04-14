// src/routes/upload.routes.js

import express from "express";
import multer from "multer";
import { uploadPdf } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("pdf"), uploadPdf);

export default router;