import axios from 'axios';
import { getToken, storeToken, removeToken } from '@services/authStorage';
import Config from 'react-native-config';

const api = axios.create({ baseURL: Config.BACKEND_URL });

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

api.interceptors.request.use(async config => {
  const { accessToken } = await getToken();
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
      /* 이미 갱신 중이면 큐에 등록 후 대기 */
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    try {
      refreshing = true;
      const { refreshToken, id } = await getToken();

      const { data } = await axios.post(
        'http://<YOUR_BACKEND>:4000/api/auth/refresh',
        { id, refreshToken }
      );

      await setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken, id });
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      processQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      await clearToken();                              // 로그아웃
      return Promise.reject(refreshErr);
    } finally {
      refreshing = false;
    }
  }
);

export default api;