import api from './index';

// 아이디로 유저 찾기
export const searchUserByID = async id => {
  const params = {id: id};
  try {
    const res = await api.get('/api/users/search', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 아이디 검색 오류:', error);
    throw error;
  }
};
