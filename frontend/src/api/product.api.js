import api from "./axios";

export const fetchProducts = async (page = 1) => {
  const res = await api.get(`/products?page=${page}`);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
