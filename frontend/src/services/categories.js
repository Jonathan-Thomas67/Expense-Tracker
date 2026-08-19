import api from "./api";

export const listCategories = async (params = {}) => (await api.get("/categories/", { params })).data;
export const createCategory = async (payload) => (await api.post("/categories/", payload)).data;
export const updateCategory = async (id, payload) => (await api.put(`/categories/${id}/`, payload)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}/`)).data;
