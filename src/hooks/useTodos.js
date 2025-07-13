import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchTodos } from '@api/todos';

export const useTodos = date => {
  const day = dayjs(date).format('YYYY-MM-DD');
  return useQuery(['todos', day], () =>
    fetchTodos({ start: day, end: day })
  );
};