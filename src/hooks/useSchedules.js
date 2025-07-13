import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchSchedules } from '@api/schedules';

export const useSchedules = date => {
  const day = dayjs(date).format('YYYY-MM-DD');
  return useQuery(
    ['schedule', 'day', day],
    () => fetchSchedules({ start: day, end: day }),
    {
      retry: (count, err) => {
        // 404∙400 같은 클라이언트 오류면 재시도 X
        if (err?.response?.status >= 400 && err?.response?.status < 500) return false;
        // 그 외(네트워크, 5xx)는 2회까지만 재시도
        return count < 2;
      },
      staleTime: 1000 * 60, // 1분 간 fresh
    },
  );
};

export const useWeekSchedules = weekDate => {
  const d = dayjs(weekDate);

  // day() : 0 = Sunday, 6 = Saturday
  const start = d.subtract(d.day(), 'day').format('YYYY-MM-DD');      // 이번 주 일요일
  const end   = d.add(6 - d.day(), 'day').format('YYYY-MM-DD');       // 이번 주 토요일

  return useQuery(['schedules', 'week', start], () =>
    fetchSchedules({ start, end })
  );
};

export const useMonthSchedules = monthDate => {
  const start = dayjs(monthDate).startOf('month').format('YYYY-MM-DD');
  const end   = dayjs(monthDate).endOf('month').format('YYYY-MM-DD');
  return useQuery(['schedules', 'month', start], () =>
    fetchSchedules({ start, end })
  );
};