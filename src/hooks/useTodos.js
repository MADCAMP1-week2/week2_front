import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {fetchTodos} from '@api/todos';

export const useTodos = (date, projectId) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['todos', formattedDate, projectId],
    queryFn: () => fetchTodos(date, projectId),
    enabled: !!date, // date 없을 땐 fetch 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시 유지
  });
};
