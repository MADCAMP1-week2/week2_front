import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import authStorage from '../services/authStorage';
import axios from 'axios';
import Config from 'react-native-config';

const BACKEND_URL = Config.BACKEND_URL;

function SettingsScreen({onLogout}) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [id, setId] = useState(null);

  // 로그인한 기기 관련
  const [devices, setDevices] = useState([]);
  const [showDevices, setShowDevices] = useState(false);

  // 최초 1회 토큰 불러오기
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await authStorage.getToken();
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setId(tokens.id);
        console.log('✅ [토큰 로딩 완료]:', tokens);
      } catch (error) {
        console.error('❌ [토큰 로딩 실패]:', error);
      }
    };

    loadTokens();
  }, []);

  const handleLogout = async logoutAll => {
    if (!accessToken) {
      console.warn('⛔ [accessToken 없음]: 로그아웃 요청을 중단합니다');
      return;
    }

    const url = `${BACKEND_URL}/api/auth/logout${logoutAll ? '-all' : ''}`;

    try {
      const response = await axios.delete(url, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status === 204) {
        console.log(
          `✅ [${logoutAll ? '모든 기기' : '현재 기기'}에서 로그아웃 완료]`,
        );
        await authStorage.removeToken(); // asyncStorage에서 삭제
        onLogout();
      }
    } catch (error) {
      console.error(
        `❌ [${logoutAll ? '모든 기기' : '현재 기기'} 로그아웃 실패]:`,
        error,
      );
    }
  };

  const fetchLoginDevices = async () => {
    if (!accessToken) {
      console.warn('⛔ accessToken 없음: 요청을 중단합니다');
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/devices`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      console.log(response.data);
      setDevices(response.data.devices);
    } catch (error) {
      console.error(`❌ [기기 불러오기 실패]:`, error);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>설정 화면</Text>
      <Button
        title="로그아웃"
        onPress={() => {
          handleLogout(false);
        }}
      />
      <Button
        title="모든 기기에서 로그아웃"
        onPress={() => {
          handleLogout(true);
        }}
      />
      <Button
        title="로그인한 기기 보기"
        onPress={() => {
          fetchLoginDevices();
        }}
      />
      {devices.length > 0 && (
        <View style={{marginTop: 20}}>
          <Text>로그인된 기기 목록:</Text>
          {devices.map((device, index) => (
            <View key={device.deviceId || index}>
              <Text>📱 기기 ID: {device.deviceId}</Text>
              <Text>🕒 만료 날짜: {device.expiresAt}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default SettingsScreen;
