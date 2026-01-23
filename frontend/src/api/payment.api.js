import api from "./axios";

export const createPayment = async (orderId) => {
  const res = await api.post("/payments/create", { orderId });
  return res.data;
};
