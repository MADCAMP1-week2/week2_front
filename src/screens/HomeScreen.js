import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import authStorage from '../services/authStorage';

function HomeScreen() {
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchNickname = async () => { // 내용 추가해서 닉네임 불러오는 것으로 수정
      try {
        const tokenData = await authStorage.getToken();
        setId(tokenData.id || '');
      } catch (error) {
        console.error('❌ ID 불러오기 실패:', error);
      }
    };

    fetchNickname();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>홈 화면</Text>
      <Text>{id ? `환영합니다, ${id}님!` : '아이디 불러오는 중...'}</Text>
    </View>
  );
}

export default HomeScreen;
