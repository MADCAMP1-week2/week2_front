import React, {createContext, useState, useEffect} from 'react';
import authStorage from '../services/authStorage';
import {ToastAndroid} from 'react-native';
import api, {setLogoutHandler} from '../api/index';
import Config from 'react-native-config';

const BACKEND_URL = Config.BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: 로딩 중

  const login = async tokens => {
    await authStorage.storeToken(tokens);
    setIsLoggedIn(true);
  };

  const logout = async (reason, logoutAll) => {
    const tokens = await authStorage.getToken();
    const accessToken = tokens?.accessToken;

    if (!accessToken) {
      console.warn('⛔ [accessToken 없음]: 로그아웃 요청 중단');
      await authStorage.clearToken();
      setIsLoggedIn(false);
      return;
    }

    const url = `${BACKEND_URL}/api/auth/logout${logoutAll ? '-all' : ''}`;

    try {
      const response = await api.delete(url);

      if (response.status === 204) {
        console.log(
          `✅ [${logoutAll ? '모든 기기' : '현재 기기'} 로그아웃 성공]`,
        );
      }
    } catch (error) {
      console.error('❌ [로그아웃 요청 실패]', error);
    } finally {
      await authStorage.clearToken();
      setIsLoggedIn(false);
      if (reason) {
        ToastAndroid.show(reason, ToastAndroid.SHORT);
      }
    }
  };

  // 앱 시작 시 토큰 검사
  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokens = await authStorage.getToken();
        if (tokens?.accessToken && tokens?.refreshToken && tokens?.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkToken();
    setLogoutHandler(logout);
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
