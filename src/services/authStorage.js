import AsyncStorage from '@react-native-async-storage/async-storage';

const authStorage = {
  storeToken: async (accessToken, refreshToken, user) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('id', user.id);
    } catch (error) {
      console.error('❌ 토큰 저장 중 오류가 발생했습니다.', error);
    }
  },

  getToken: async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const id = await AsyncStorage.getItem('id');
      return {accessToken: accessToken, refreshToken: refreshToken, id: id};
    } catch (error) {
      console.error('❌ 토큰을 불러오는 중 오류가 발생했습니다.', error);
      return {accessToken: null, refreshToken: null, id: null};
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('id');
    } catch (error) {
      console.error('⚠️ 토큰 삭제 중 오류가 발생했습니다.', error);
    }
  },
};

export default authStorage;
