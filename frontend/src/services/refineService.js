import apiClient from "./apiClient";

export const uploadNotes = async (file, deckId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("deckId", deckId);

  const res = await apiClient.post("/refine/upload", formData);
  return res.data;
};

export const fetchDecks = async () => {
  const res = await apiClient.get("/refine/decks");
  return res.data;
};

export const createDeck = async (title) => {
  const res = await apiClient.post("/refine/decks", { title });
  return res.data;
};

export const renameDeck = async (deckId, title) => {
  const res = await apiClient.put(`/refine/decks/${deckId}`, { title });
  return res.data;
};

export const deleteDeck = async (deckId) => {
  const res = await apiClient.delete(`/refine/decks/${deckId}`);
  return res.data;
};

export const fetchQuizzesByDeck = async (deckId) => {
  const res = await apiClient.get(`/refine/quizzes/${deckId}`);
  return res.data;
};

export const submitAttempt = async (quizId, responses) => {
  const res = await apiClient.post("/refine/attempt", {
    quizId,
    responses,
  });

  return res.data;
};

export const fetchResponses = async (quizId) => {
  const res = await apiClient.get(`/refine/responses/${quizId}`);
  return res.data;
};

export const fetchAllQuizzes = async () => {
  const res = await apiClient.get("/refine/quizzes");
  return res.data;
};

export const updateQuizTitle = async (quizId, title) => {
  const res = await apiClient.put(`/refine/quiz/${quizId}`, { title });
  return res.data
};

export const deleteQuiz = async (quizId) => {
  const res = await apiClient.delete(`/refine/quiz/${quizId}`);
  return res.data
};