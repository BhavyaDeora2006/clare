let intents = []

export const getAllIntents = (req, res) => {
  res.json(intents)
}

export const createIntent = (req, res) => {
  const { title, description } = req.body

  if (!title) {
    return res.status(400).json({ message: "Title is required" })
  }

  const newIntent = {
    id: Date.now(),
    title,
    description
  }

  intents.push(newIntent)
  res.status(201).json(newIntent)
}

export const updateIntent = (req, res) => {
  const id = parseInt(req.params.id)
  const { title, description } = req.body

  const intent = intents.find(i => i.id === id)

  if (!intent) {
    return res.status(404).json({ message: "Intent not found" })
  }

  intent.title = title || intent.title
  intent.description = description || intent.description

  res.json(intent)
}

export const deleteIntent = (req, res) => {
  const id = parseInt(req.params.id)

  intents = intents.filter(i => i.id !== id)

  res.json({ message: "Intent deleted successfully" })
}