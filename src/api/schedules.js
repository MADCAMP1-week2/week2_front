import api from './index';

export const fetchSchedules = async ({ start, end }) => {
  const res = await api.get('/schedules', { params: { start, end } });
  return res.data;
};