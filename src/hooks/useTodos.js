import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  fetchTodos,
  addTodo as addTodoAPI,
  updateTodo as updateTodoAPI,
  updateTodoCompletedStatus as updateCompletedAPI,
  deleteTodo as deleteTodoAPI,
} from '@api/todos';

export const useTodos = (date, projectId) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  return useQuery({
    queryKey: ['todos', formattedDate, projectId],
    queryFn: () => fetchTodos(date, projectId),
    enabled: !!date, // date 없을 땐 fetch 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시 유지
  });
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTodoAPI,
    onSuccess: (_, newTodo) => {
      const date = newTodo.date;
      const projectId = newTodo.projectId || null;
      queryClient.invalidateQueries(['todos', date, projectId]);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({todoId, action, updatedTodo}) =>
      updateTodoAPI(todoId, action, updatedTodo),
    onSuccess: (_, variables) => {
      const date = variables.updatedTodo.date;
      const projectId = variables.updatedTodo.projectId || null;
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      queryClient.invalidateQueries(['todos', formattedDate, projectId]);
    },
  });
};

export const useTodoComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({todoId, completed, date}) =>
      updateCompletedAPI(todoId, completed, date),
    onSuccess: (_, variables) => {
      const formattedDate = dayjs(variables.date).format('YYYY-MM-DD');
      queryClient.invalidateQueries(['todos', formattedDate, null]);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({todoId, action, date}) => deleteTodoAPI(todoId, action, date),
    onSuccess: (_, variables) => {
      const formattedDate = dayjs(variables.date).format('YYYY-MM-DD');
      queryClient.invalidateQueries(['todos', formattedDate, null]);
    },
  });
};
