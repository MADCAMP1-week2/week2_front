import axios from 'axios';
import authStorage from '../services/authStorage';
import Config from 'react-native-config';

const BACKEND_URL = Config.BACKEND_URL;

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

const api = axios.create({
  baseURL: BACKEND_URL,
});

// 요청 인터셉터: accessToken 헤더에 자동 삽입
api.interceptors.request.use(async config => {
  const tokens = await authStorage.getToken();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// 응답 인터셉터: accessToken 만료 시 refresh → 재요청
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = await authStorage.getToken();
        const res = await axios.post(`${BACKEND_URL}/api/auth/refresh`, {
          refreshToken: tokens?.refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        await authStorage.storeToken({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: {id: tokens.id},
        });

        // 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ [토큰 재발급 실패]:', refreshError);
        if (logoutHandler) {
          logoutHandler('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          await authStorage.clearToken();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
