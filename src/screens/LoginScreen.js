import React, {useEffect, useState, useContext} from 'react';
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
import DeviceInfo from 'react-native-device-info';
import {AuthContext} from '../../contexts/AuthContext';
import api from '../api/client';
import greetingStyles from '../styles/greetingStyles';

const LoginScreen = () => {
  const {login} = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    password: '',
  });

  const handleIdChange = text => {
    setUserInfo(prev => ({...prev, id: text}));
  };

  const handlePwChange = text => {
    setUserInfo(prev => ({...prev, password: text}));
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const deviceId = await DeviceInfo.getUniqueId(); // deviceId
      const payload = {...userInfo, deviceId: deviceId};

      console.log('📦 [로그인 요청] 전송할 정보:', payload);

      const response = await api.post(
        `/api/auth/login`,
        payload,
        {validateStatus: status => status === 200 || status === 401}, // 200과 401을 정상 처리
      );

      if (response.status === 401) {
        ToastAndroid.show(
          '아이디 혹은 비밀번호가 올바르지 않습니다.',
          ToastAndroid.SHORT,
        );
        setIsLoading(false);
        return;
      }

      console.log('✅ [로그인 성공]', response.data.user);

      // token과 id 정보 asyncStorage에 저장하기
      const {accessToken, refreshToken, user} = response.data;
      await login({accessToken, refreshToken, user});
    } catch (error) {
      if (error.response) {
        console.error('❌ [로그인 실패]', error.response.data.message);
      } else {
        console.error('⚠️ [로그인 오류]:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={greetingStyles.container}>
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
