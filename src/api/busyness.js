import api from './index';

// 바쁨지수 가져오기
export const fetchBusynessScore = async date => {
  // date를 YYYY-MM-DD 형식으로 변환
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const params = {date: formattedDate};
  try {
    const res = await api.get('/api/busyness', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 바쁨지수 불러오기 오류:', error);
    throw error;
  }
};
