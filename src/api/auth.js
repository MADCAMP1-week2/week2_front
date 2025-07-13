import api from './index';
import DeviceInfo from 'react-native-device-info';

//login 요청
export const loginRequest = async ({ id, password }) => {
  const deviceId = await DeviceInfo.getUniqueId();
  const payload = { id, password, deviceId };

  const res = await api.post('/api/auth/login', payload, {
    validateStatus: status => status === 200 || status === 401,
  });

  return res;
};

// 아이디 중복 검사
export const checkIdAvailable = async id => {
  const res = await api.get('/api/auth/check-id', {
    params: { id },
  });
  return res.data.available; // true / false
};

// 회원가입 요청
export const registerUser = async ({ nickname, id, password }) => {
  const res = await api.post('/api/auth/register', {
    nickname,
    id,
    password,
  });
  return res.data;
};

// 로그아웃 요청
export const logoutRequest = async (logoutAll = false) => {
  const url = `/api/auth/logout${logoutAll ? '-all' : ''}`;
  return await api.delete(url); // 응답은 그대로 전달
};

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};