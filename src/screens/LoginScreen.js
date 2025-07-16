import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  ToastAndroid,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {AuthContext} from '@contexts/AuthContext';
import {loginRequest} from '@api/auth';
import greetingStyles from '../styles/greetingStyles';
import axios from 'axios';

const LoginScreen = () => {
  const {login} = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({id: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------------ */
  /* ① 마운트 여부 확인용 ref                                           */
  /* ------------------------------------------------------------------ */
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;          // 화면이 나타날 때 true
    return () => {
      isMounted.current = false;       // 언마운트될 때 false
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* ② axios 취소 토큰(선택)                                            */
  /* ------------------------------------------------------------------ */
  const abortRef = useRef(null);     // AbortController 저장

  const handleLogin = async () => {
    if (isLoading) return;           // 중복 클릭 방지
    setIsLoading(true);

    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const payload  = {...userInfo, deviceId};

      /* AbortController 생성 & 저장 */
      abortRef.current = new AbortController();
      console.log("Dd")
      // const res = await loginRequest(payload, abortRef.current.signal);
      const res = await axios.post(
        `http://192.249.26.139:3000/api/auth/login`,
        payload,
        {
          // ※ AbortController·인터셉터 모두 제거
          timeout: 10000,                          // 10 초 후 타임아웃 → catch
          validateStatus: () => true,              // 어떤 상태코드든 catch 막지 않음
        }
      );

      if (!isMounted.current) return;             // 이미 화면이 사라졌다면 무시

      if (res.status === 401) {
        ToastAndroid.show('아이디 또는 비밀번호가 올바르지 않습니다.', ToastAndroid.SHORT);
        return;
      }

      if (!res || !res.data) {
        console.log('❌ 응답이 비어있음:', res);
        ToastAndroid.show('서버 응답이 없습니다.', ToastAndroid.SHORT);
        return;
      }


      const {accessToken, refreshToken, user} = res.data;
      await login({accessToken, refreshToken, user}); // ↙︎ Main으로 네비게이션 (AuthContext 내부)
      /* 여기서 LoginScreen 은 곧 언마운트됨 */
    } catch (err) {
      if (!isMounted.current) return;

      const msg =
        err?.response?.data?.message ??
        (err.name === 'CanceledError' ? '요청이 취소되었습니다.' : err.message);
      ToastAndroid.show(`로그인 실패: ${msg}`, ToastAndroid.SHORT);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 언마운트 클린업 : axios 요청 취소                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  /* ---------------------------- UI ---------------------------------- */
  const handleIdChange = text => setUserInfo(p => ({...p, id: text}));
  const handlePwChange = text => setUserInfo(p => ({...p, password: text}));

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
        title={isLoading ? '로그인 중...' : '로그인'}
        onPress={handleLogin}
        disabled={!userInfo.id || !userInfo.password || isLoading}
      />
    </View>
  );
};

export default LoginScreen;
