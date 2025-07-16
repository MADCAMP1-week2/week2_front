import api from './index';

export const fetchSchedules = async ({ start, end }) => {
  const res = await api.get('api/schedules', { params: { start, end } });
  console.log("hey", res.data);
  return res.data;
};