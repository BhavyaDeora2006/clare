import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("CLARE Backend Running")
})

app.listen(9000, () => {
  console.log("Server running on port 9000")
})
