import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import authStorage from '../services/authStorage';

function HomeScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [id, setId] = useState(null);

  // 최초 1회 토큰 불러오기
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await authStorage.getToken();
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setId(tokens.user.id || '');
        console.log('✅ [토큰 로딩 완료]:', tokens);
      } catch (error) {
        console.error('❌ [토큰 로딩 실패]:', error);
      }
    };

    loadTokens();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>홈 화면</Text>
      <Text>{id ? `환영합니다, ${id}님!` : '아이디 불러오는 중...'}</Text>
    </View>
  );
}

export default HomeScreen;
