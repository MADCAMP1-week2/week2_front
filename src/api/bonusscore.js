import api from './index';

// 보너스 점수 가져오기 (로그인한 유저)
export const fetchBonusScore = async date => {
  // date를 YYYY-MM-DD 형식으로 변환
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const params = {date: formattedDate};
  try {
    const res = await api.get('/api/bonus', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 보너스 점수 불러오기 오류:', error);
    throw error;
  }
};

// 보너스 점수 랭킹 가져오기
export const fetchBonusRank = async date => {
  // date를 YYYY-MM-DD 형식으로 변환
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const params = {date: formattedDate};
  try {
    const res = await api.get('/api/bonus/rank', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 보너스 점수 랭킹 불러오기 오류:', error);
    throw error;
  }
};
