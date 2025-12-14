import api from "./api";

// Fetch all speakers
export const getSpeakers = async () => {
  const res = await api.get("/speakers");
  return res.data; // IMPORTANT: return only data
};

// Fetch single speaker
export const getSpeakerById = async (id) => {
  const res = await api.get(`/speaker/${id}`);
  return res.data;
};