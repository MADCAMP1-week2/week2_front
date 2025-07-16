import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {fetchSchedules} from '@api/schedules';

export const useSchedules = (date, projectId) => {
  const start = dayjs(date).startOf('day').format('YYYY-MM-DD');
  const end = dayjs(date).endOf('day').format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['schedules', start, end, projectId],
    queryFn: () => fetchSchedules(start, end, projectId),
    enabled: !!date, // date 없을 땐 fetch 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
  });
};

export const useWeekSchedules = (weekDate, projectId) => {
  const start = dayjs(weekDate)
    .startOf('week')
    .startOf('day')
    .format('YYYY-MM-DD');
  const end = dayjs(weekDate).endOf('week').endOf('day').format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['schedules', start, end, projectId],
    queryFn: () => fetchSchedules(start, end, projectId),
    enabled: !!weekDate, // date 없을 땐 fetch 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
  });
};

export const useMonthSchedules = (monthDate, projectId) => {
  const start = dayjs(monthDate)
    .startOf('month')
    .startOf('day')
    .format('YYYY-MM-DD');
  const end = dayjs(monthDate).endOf('month').endOf('day').format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['schedules', start, end, projectId],
    queryFn: () => fetchSchedules(start, end, projectId),
    enabled: !!monthDate, // date 없을 땐 fetch 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
  });
};
