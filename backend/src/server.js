import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import protectedRoutes from "./routes/protected.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors())
app.use(express.json())

app.use("/api", protectedRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})