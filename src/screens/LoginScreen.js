import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Form,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import authStorage from '../services/authStorage';
import DeviceInfo from 'react-native-device-info';

const BACKEND_URL = Config.BACKEND_URL;

const LoginScreen = ({onLogin}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    password: '',
  });
  /*
  useEffect(() => {
    let isMounted = true; // 플래그 설정

    // cleanup 함수에서 플래그 해제
    return () => {
      isMounted = false;
    };
  }, []);*/

  const handleIdChange = text => {
    setUserInfo(prev => ({...prev, id: text}));
  };

  const handlePwChange = text => {
    setUserInfo(prev => ({...prev, password: text}));
  };

  const handleLogin = async () => {
    setIsLoading(true);

    const deviceId = await DeviceInfo.getUniqueId(); // deviceId
    const payload = {
      ...userInfo,
      deviceId: deviceId,
    };

    console.log('📦 [로그인 요청] 전송할 정보:', payload);

    let isMounted = true; // 플래그 설정

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        payload,
      );

      console.log('✅ [로그인 성공]', response.data.user);

      if (isMounted) setIsLoading(false);

      // token과 id 정보 asyncStorage에 저장하기
      const {accessToken, refreshToken, user} = response.data;
      await authStorage.storeToken(accessToken, refreshToken, user);
      if (isMounted) onLogin();
    } catch (error) {
      if (isMounted) setIsLoading(false);

      if (error.response) {
        console.error('❌ [로그인 실패]', error.response.data.message);
      } else {
        console.error('⚠️ [로그인 오류]:', error.message);
      }
    }
    return () => {
      isMounted = false; // 함수 끝날 때 플래그 해제
    };
  };

  return (
    <View>
      <TextInput
        placeholder="아이디를 입력하세요"
        value={userInfo.id}
        onChangeText={handleIdChange}
      />
      <TextInput
        placeholder="비밀번호를 입력하세요"
        value={userInfo.password}
        onChangeText={handlePwChange}
        secureTextEntry
      />
      <Button
        title="로그인"
        onPress={handleLogin}
        disabled={userInfo.id === '' || userInfo.password === '' || isLoading}
      />
    </View>
  );
};

export default LoginScreen;
