import api from "./api";

export const validateLogin = async (payload) => {
  const { data } = await api.post("/validate", payload);
  return data;
};