import api from "./axios";

export const createOrder = async (items) => {
  const res = await api.post("/orders", { items });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};
