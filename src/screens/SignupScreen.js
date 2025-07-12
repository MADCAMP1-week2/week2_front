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
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';
import greetingStyles from '../styles/greetingStyles';

const BACKEND_URL = Config.BACKEND_URL;

const SignupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    id: '',
    password: '',
  });
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isPWMatch, setIsPWMatch] = useState(null);

  const isVaild =
    userInfo.nickname && // 닉네임을 입력했는가?
    isIdAvailable === true && // 사용 가능한 아이디인가?
    isPWMatch === true; // 비밀번호와 비밀번호 확인에 입력한 내용이 일치하는가?

  // if(isValid === true) 회원가입 버튼 활성화

  const handleNicknameChange = text => {
    setUserInfo(prev => ({...prev, nickname: text}));
  };

  const handleIdChange = text => {
    setUserInfo(prev => ({...prev, id: text}));
  };

  const handlePasswordChange = text => {
    setUserInfo(prev => ({...prev, password: text}));
  };

  const handlePasswordCheckChange = text => {
    setPasswordCheck(text);
  };

  // 아이디 중복 검사
  const CheckIdAvailable = async () => {
    // 어쩌구 저쩌구 수정하시긔
    if (userInfo.id === '') {
      setIsIdAvailable(null);
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/check-id`, {
        params: {id: userInfo.id},
      });
      if (response.data.available) {
        setIsIdAvailable(true); // 중복되지 않는 아이디
      } else {
        setIsIdAvailable(false); // 중복된 아이디
      }
    } catch (error) {
      console.error('⚠️ [ID 확인 오류] 서버 요청 중 오류 발생:', error.message);
      setIsIdAvailable(null);
    }
  };

  // 비밀번호 확인
  const CheckPasswordMatch = () => {
    if (passwordCheck === '') {
      setIsPWMatch(null);
      return;
    } else if (userInfo.password === passwordCheck) {
      setIsPWMatch(true);
      return;
    } else {
      setIsPWMatch(false);
      return;
    }
  };

  // BACKEND에 회원 정보 POST
  const handleSignup = async () => {
    setIsLoading(true);
    console.log('📦 [회원가입 요청] 전송할 정보:', userInfo);

    let isMounted = true; // 플래그 설정

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        userInfo,
      );
      console.log('✅ [회원가입 성공]', response.data);

      if (isMounted) {
        setIsLoading(false);
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response) {
        console.error('❌ [회원가입 실패]:', error.response.data.message);
      } else {
        console.error('⚠️ [네트워크 오류]:', error.message);
      }
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    CheckIdAvailable();
    CheckPasswordMatch();
  }, [userInfo.id, passwordCheck]);

  return (
    <View style={greetingStyles.container}>
      <TextInput
        placeholder="닉네임을 입력해주세요."
        value={userInfo.nickname}
        onChangeText={handleNicknameChange}
      />
      <TextInput
        placeholder="아이디를 입력해주세요." // (영문 및 숫자, 6자 이상) <- 아이디 형식 검토 기능 아직 안 함
        value={userInfo.id}
        onChangeText={handleIdChange}
      />
      {isIdAvailable !== null &&
        (isIdAvailable === true ? (
          <Text>사용 가능한 아이디입니다.</Text>
        ) : (
          <Text>이미 사용 중인 아이디입니다.</Text>
        ))}
      <TextInput
        placeholder="비밀번호를 입력해주세요." // (영문 및 숫자, 8자 이상) <- 비밀번호 형식 검토 기능 아직 안 함
        value={userInfo.password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <TextInput
        placeholder="비밀번호를 다시 한번 입력해주세요."
        value={passwordCheck}
        onChangeText={handlePasswordCheckChange}
        secureTextEntry
      />
      {isPWMatch === false && <Text>비밀번호가 일치하지 않습니다.</Text>}
      <Button title="회원가입" onPress={handleSignup} disabled={!isVaild} />
    </View>
  );
};

export default SignupScreen;
