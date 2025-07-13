import api from './index';

export const fetchTodos = async ({ start, end }) => {
  const res = await api.get('/todos', { params: { start, end } });
  return res.data; // [{ id, title, deadline, completed, owner }]
};
