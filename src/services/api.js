import axios from "axios";

const API_URL = "https://whatsapp-backend-l8tf.onrender.com/"; // change if backend is deployed

export const getChats = async () => {
  const res = await axios.get(`${API_URL}conversations`);
  return res.data;
};

export const getMessages = async (wa_id) => {
  const res = await axios.get(`${API_URL}messages/${wa_id}`);
  return res.data;
};

export const sendMessage = async (wa_id, text) => {
  const res = await axios.post(`${API_URL}send`, { wa_id, text });
  return res.data.message;
};
