import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'tokens';

const authStorage = {
  storeToken: async ({accessToken, refreshToken, user}) => {
    const tokenObj = {accessToken, refreshToken, user};
    try {
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenObj));
    } catch (error) {
      console.error('❌ 토큰 저장 중 오류가 발생했습니다.', error);
      throw error;
    }
  },

  // 저장된 토큰 반환
  getToken: async () => {
    try {
      const json = await AsyncStorage.getItem(TOKEN_KEY);
      return json
        ? JSON.parse(json)
        : {accessToken: null, refreshToken: null, user: null};
    } catch (error) {
      console.error('❌ 토큰을 불러오는 중 오류가 발생했습니다.', error);
      return {accessToken: null, refreshToken: null, user: null};
    }
  },

  // 토큰 삭제
  clearToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('⚠️ 토큰 삭제 중 오류가 발생했습니다.', error);
      throw error;
    }
  },
};

export default authStorage;
