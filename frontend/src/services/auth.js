import api from "./api";

export async function register(payload) {
  const { data } = await api.post("/auth/register/", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login/", payload);
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("access");
}

export async function getProfile() {
  const { data } = await api.get("/profile/");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/profile/", payload);
  return data;
}
