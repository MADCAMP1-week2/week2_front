import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchSchedules } from '@api/schedules';

export const useSchedules = date => {
  const day = dayjs(date).format('YYYY-MM-DD');
  return useQuery(['schedules', day], () =>
    fetchSchedules({ start: day, end: day })
  );
};

export const useWeekSchedules = weekDate => {
  const d = dayjs(weekDate);

  // day() : 0 = Sunday, 6 = Saturday
  const start = d.subtract(d.day(), 'day').format('YYYY-MM-DD');      // 이번 주 일요일
  const end   = d.add(6 - d.day(), 'day').format('YYYY-MM-DD');       // 이번 주 토요일

  return useQuery(['schedules', start], () =>
    fetchSchedules({ start, end })
  );
};

export const useMonthSchedules = monthDate => {
  const start = dayjs(monthDate).startOf('month').format('YYYY-MM-DD');
  const end   = dayjs(monthDate).endOf('month').format('YYYY-MM-DD');
  return useQuery(['schedules', start], () =>
    fetchSchedules({ start, end })
  );
};