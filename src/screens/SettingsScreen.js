import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button, TextInput, Switch} from 'react-native';
import authStorage from '../services/authStorage';
import {AuthContext} from '@contexts/AuthContext';
import api from '../api/index';

function SettingsScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [id, setId] = useState(null);

  // 로그인한 기기
  const [devices, setDevices] = useState([]);

  // 카테고리
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '',
    isPublic: false,
  });
  const [categories, setCategories] = useState([]);
  const [jsonCategories, setJsonCategories] = useState(false);

  const {logout} = useContext(AuthContext);

  const handleNewCategoryName = text => {
    setNewCategory(prev => ({...prev, name: text}));
  };
  const handleNewCategoryColor = text => {
    setNewCategory(prev => ({...prev, color: text}));
  };
  const handleNewCategoryIsPublic = boolean => {
    setNewCategory(prev => ({...prev, isPublic: boolean}));
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // 최초 1회 토큰 불러오기
        const tokens = await authStorage.getToken();
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setId(tokens.id);
        console.log('✅ [토큰 로딩 완료]:', tokens);

        // 카테고리 불러오기
        await fetchUserCategories(tokens.accessToken);
      } catch (error) {
        console.error('❌ [토큰 로딩 실패]:', error);
      }
    };

    initialize();
  }, []);

  const fetchLoginDevices = async () => {
    try {
      const response = await api.get('/api/auth/devices');
      setDevices(response.data.devices);
    } catch (error) {
      console.error(`❌ [기기 불러오기 실패]:`, error);
    }
  };

  const AddCategory = async () => {
    try {
      const response = await api.post('/api/categories', newCategory);
      console.log('📂 [카테고리 추가 성공]:', response.data);
      fetchUserCategories(accessToken);
    } catch (error) {
      console.error('❌ [카테고리 추가 실패]:', error);
    }
  };

  const fetchUserCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
      setJsonCategories(true);
    } catch (error) {
      console.error('카테고리 불러오기 에러:', error);
      setCategories([]);
    }
  };

  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text>설정 화면</Text>
    //   <Button
    //     title="현재 기기에서 로그아웃"
    //     onPress={() => logout('로그아웃되었습니다.', false)}
    //   />
    //   <Button
    //     title="모든 기기에서 로그아웃"
    //     onPress={() => logout('모든 기기에서 로그아웃되었습니다.', true)}
    //   />
    //   <Button
    //     title="로그인한 기기 보기"
    //     onPress={() => {
    //       fetchLoginDevices();
    //     }}
    //   />
    //   {devices.length > 0 && (
    //     <View>
    //       <Text>로그인된 기기 목록:</Text>
    //       {devices.map((device, index) => (
    //         <View key={device.deviceId || index}>
    //           <Text>📱 기기 ID: {device.deviceId}</Text>
    //           <Text>🕒 만료 날짜: {device.expiresAt}</Text>
    //         </View>
    //       ))}
    //     </View>
    //   )}
    //   <View>
    //     <TextInput
    //       placeholder="새로운 카테고리"
    //       value={newCategory.name}
    //       onChangeText={handleNewCategoryName}
    //     />
    //     <TextInput
    //       placeholder="색상코드"
    //       value={newCategory.color}
    //       onChangeText={handleNewCategoryColor}
    //     />
    //     <View>
    //       <Text>공개</Text>
    //       <Switch
    //         value={newCategory.isPublic}
    //         onValueChange={handleNewCategoryIsPublic}
    //       />
    //     </View>
    //     <Button
    //       title="카테고리 추가"
    //       onPress={() => {
    //         AddCategory();
    //       }}
    //     />
    //   </View>

    //   {jsonCategories ? (
    //     categories.length > 0 &&
    //     categories.map(category => (
    //       <View key={category._id}>
    //         <Text style={{color: `${category.color}`}}>
    //           {category.name}
    //           {category.isPublic ? '(공개)' : '(비공개)'}
    //         </Text>
    //       </View>
    //     ))
    //   ) : (
    //     <Text>카테고리 불러오는 중...</Text>
    //   )}
    // </View>
    <Text>카테고리 불러오는 중...</Text>
  );
}

export default SettingsScreen;
