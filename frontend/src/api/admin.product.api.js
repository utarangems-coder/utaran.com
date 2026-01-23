import api from "./axios";

export const fetchAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/admin/products/${id}`);
};

export const restoreProduct = async (id) => {
  await api.patch(`/admin/products/${id}/restore`);
};
