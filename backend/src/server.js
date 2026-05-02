import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import protectedRoutes from "./routes/protected.routes.js"
import preferencesRoutes from "./routes/preferences.routes.js"
import learningRoutes from "./routes/learning.routes.js";
import echoRoutes from "./routes/echo.routes.js";
import cardRoutes from "./routes/card.routes.js";
import refineRoutes from "./routes/refine.routes.js";
import askRoutes from "./routes/ask.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9000
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
// app.use(cors())
app.use("/api/upload", uploadRoutes);
app.use(express.json())

app.use("/api", protectedRoutes)
app.use("/api", learningRoutes);
app.use("/api/preferences", preferencesRoutes)
app.use("/api/cards", cardRoutes);
app.use("/api/echo", echoRoutes);
app.use("/api/refine", refineRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/user", userRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})