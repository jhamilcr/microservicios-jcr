import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "http://localhost:80",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response || response.status !== 401 || config.__isRetry) throw error;
    config.__isRetry = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (!refreshToken) throw error;

    if (!refreshing) {
      
      refreshing = api.post("/api/auth/refresh", { token: refreshToken })
        .then(r => {
          const { accessToken, refreshToken: newRefresh } = r.data;
          setTokens(accessToken, newRefresh);
          return accessToken;
        })
        .catch(e => { logout(); throw e; })
        .finally(() => { refreshing = null; });
    }

    const newAccess = await refreshing;
    config.headers.Authorization = `Bearer ${newAccess}`;
    return api(config);
  }
);

export default api;
