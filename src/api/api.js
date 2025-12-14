import axios from "axios";

const api = axios.create({
  baseURL: "https://aditechsolutions.com/sid/myneuron",
});

api.interceptors.request.use((config) => {
  // ---------------------------
  // 1) ADD TIMESTAMP TO ALL GET REQUESTS
  // ---------------------------
  if (config.method?.toLowerCase() === "get") {
    const ts = Date.now();

    // merge with existing params
    config.params = {
      ...(config.params || {}),
      _t: ts,       // using _t to avoid clashing with real param names (_t = timestamp)
    };
  }

  // ---------------------------
  // 2) ATTACH TOKEN
  // ---------------------------
  const token = localStorage.getItem("token");
  console.log("using token", token);

  if (token && config.url !== "/validate") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;