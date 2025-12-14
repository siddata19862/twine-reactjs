import api from "./api";

// -----------------------------------------
// CREATE HANDSHAKE  (POST /handshake)
// -----------------------------------------
export const createHandshake = async ({ receiver_id }) => {
  const res = await api.post("/handshake", {
    receiver_id,
  });
  return res.data; // return only data
};

// -----------------------------------------
// UPDATE HANDSHAKE STATUS (PUT /handshake/:id)
// -----------------------------------------
export const updateHandshakeStatus = async (id, status) => {
  const res = await api.put(`/handshake/${id}`, { status });
  return res.data;
};

// -----------------------------------------
// GET HANDSHAKE BY ID
// -----------------------------------------
export const getHandshakeById = async (id) => {
  const res = await api.get(`/handshake/${id}`);
  return res.data;
};


export const getMyHandshakes = async () => {
  const res = await api.get(`/my-handshakes`);
  return res.data.handshakes;
};

// -----------------------------------------
// GET ALL HANDSHAKES FOR A USER
// -----------------------------------------
export const getHandshakesForUser = async (userId) => {
  const res = await api.get(`/handshakes/${userId}`);
  return res.data;
};