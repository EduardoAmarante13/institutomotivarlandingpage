import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("motivar_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiError(err, fallback = "Algo deu errado. Tente novamente.") {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || "").filter(Boolean).join(" ") || fallback;
  return fallback;
}

export default api;
