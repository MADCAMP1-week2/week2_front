import {useQuery, useMutation} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  fetchSchedules,
  addSchedule as addScheduleAPI,
  updateSchedule as updateScheduleAPI,
  deleteSchedule as deleteScheduleAPI,
} from '@api/schedules';

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

export const useAddSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSchedule) => addScheduleAPI(newSchedule),
    onSuccess: (_, newSchedule) => {
      const date = newSchedule.startDateTime;
      const projectId = newSchedule.projectId || null;
      const day = dayjs(date).startOf('day').toISOString();
      const key = ['schedules', day, projectId];
      queryClient.invalidateQueries(key);
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, action, updatedSchedule }) =>
      updateScheduleAPI(scheduleId, action, updatedSchedule),
    onSuccess: (_, { updatedSchedule }) => {
      const date = updatedSchedule.startDateTime;
      const projectId = updatedSchedule.projectId || null;
      const day = dayjs(date).startOf('day').toISOString();
      const key = ['schedules', day, projectId];
      queryClient.invalidateQueries(key);
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, action, startDateTime }) =>
      deleteScheduleAPI(scheduleId, action, startDateTime),
    onSuccess: (_, { startDateTime, projectId }) => {
      const day = dayjs(startDateTime).startOf('day').toISOString();
      const key = ['schedules', day, projectId || null];
      queryClient.invalidateQueries(key);
    },
  });
};