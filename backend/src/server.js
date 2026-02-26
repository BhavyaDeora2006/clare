import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import intentRoutes from "./routes/intent.routes.js"

dotenv.config()
const PORT = process.env.PORT || 8000


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/intents", intentRoutes)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})