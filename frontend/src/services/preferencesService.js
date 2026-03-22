import apiClient from "./apiClient";

export const getPreferences = async () => {
  const res = await apiClient.get("/preferences");
  return res.data;
};

export const updatePreferences = async (data) => {
  const res = await apiClient.post("/preferences", data);
  return res.data;
};