import api from './index';
import dayjs from 'dayjs';

// 특정 날짜 TODOs 가져오는 GET
export const fetchTodos = async (date, projectId) => {
  // date를 YYYY-MM-DD 형식으로 변환
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const params = {
    today: formattedDate,
    ...(projectId != null && projectId !== '' && {projectId}),
    // projectId가 null/undefined가 아닐 때만 추가
  };

  try {
    const res = await api.get('/api/todos', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 불러오기 오류:', error);
    throw error;
  }
};

// 새로운 TODO 등록하는 POST
export const addTodo = async newTodo => {
  // newTodo는 json 형태
  try {
    const res = await api.post('api/todos', newTodo);
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 등록 오류:', error);
    throw error;
  }
};

// 기존 TODO 내용 수정하는 PATCH
export const updateTodo = async (todoId, action, updatedTodo) => {
  // action = "only_this_date" | "from_this_date" | "all"
  // todoId는 _id, updatedTodo는 수정사항 반영한 json ("date" 있어야함)
  try {
    const res = await api.patch(`/api/todos/${todoId}`, {
      action,
      updateData: updatedTodo,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 수정 오류:', error);
    throw error;
  }
};

// 기존 TODO 완료/미완료 반영하는 PATCH
export const updateTodoCompletedStatus = async (todoId, completed, date) => {
  // todoId는 _id, completed는 boolean, date는 YYYY-MM-YY
  try {
    const res = await api.patch(`/api/todos/${todoId}/completed`, {
      completed,
      date,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 완료 상태 업데이트 오류:', error);
    throw error;
  }
};

// 기존 TODO 삭제하는 DELETE
export const deleteTodo = async (todoId, action, date) => {
  try {
    const res = await api.delete(`/api/todos/${todoId}`, {
      action,
      date,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 삭제 오류:', error);
    throw error;
  }
};
