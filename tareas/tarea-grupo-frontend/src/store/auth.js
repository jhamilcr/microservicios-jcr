import { create } from "zustand";
import api from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setUser: (user) => set({ user }),

  loadFromStorage: () => {
    const raw = localStorage.getItem("auth");
    if (!raw) return;
    const { user, accessToken, refreshToken } = JSON.parse(raw);
    set({ user, accessToken, refreshToken });
  },

  persist: () => {
    const { user, accessToken, refreshToken } = get();
    localStorage.setItem("auth", JSON.stringify({ user, accessToken, refreshToken }));
  },

  clearStorage: () => localStorage.removeItem("auth"),

  register: async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    const { user, accessToken, refreshToken } = data;
    set({ user, accessToken, refreshToken });
    get().persist();
    return user;
  },

  login: async ({ email, password }) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    const { user, accessToken, refreshToken } = data;
    set({ user, accessToken, refreshToken });
    get().persist();
    return user;
  },

  fetchMe: async () => {
    const { data } = await api.get("/api/auth/me");
    set({ user: { id: data.id, email: data.email, role: data.role } });
    get().persist();
    return data;
  },

  logout: async () => {
    try {
      const { refreshToken } = get();
      if (refreshToken) {
        await api.post("/api/auth/logout", { token: refreshToken });
      }
    } catch { /* ignora errores de red al salir */ }
    set({ user: null, accessToken: null, refreshToken: null });
    get().clearStorage();
  },
}));
