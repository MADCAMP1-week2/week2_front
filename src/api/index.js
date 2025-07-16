import axios from 'axios';
import authStorage from '@services/authStorage'; // ✅ default import
import Config from 'react-native-config';

const api = axios.create({ baseURL: Config.BACKEND_URL });

api.interceptors.request.use(async config => {
  const { accessToken } = await authStorage.getToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/* ── ② 응답 : 401 → refresh 토큰으로 재발급 ── */
let refreshing = false;
let queue = [];

const processQueue = (err, newToken) => {
  queue.forEach(p => (err ? p.reject(err) : p.resolve(newToken)));
  queue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) return Promise.reject(err);

    original._retry = true;

    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    try {
      refreshing = true;
      const { refreshToken, user } = await authStorage.getToken();

      const { data } = await axios.post(
        `${Config.BACKEND_URL}/api/auth/refresh`,
        { id: user?.id, refreshToken }
      );

      await authStorage.storeToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: { id: user?.id },
      });

      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      processQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      await authStorage.clearToken(); // ✅ logout fallback
      return Promise.reject(refreshErr);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
