import api from './index';
import dayjs from 'dayjs';

// 특정 날짜 categories 가져오는 GET
export const fetchCategories = async () => {
  try {
    const res = await api.get('/api/categories');
    return res.data;
  } catch (error) {
    console.error('🛑 카테고리 불러오기 오류:', error);
    throw error;
  }
};

// 새로운 카테고리 등록하는 POST
export const addCategory = async newCategory => {
  // newCategory는 json 형태
  try {
    const res = await api.post('api/categories', newCategory);
    return res.data;
  } catch (error) {
    console.error('🛑 카테고리 생성 오류:', error);
    throw error;
  }
};

// 기존 카테고리 수정하는 PATCH
export const updateCategory = async (catId, updated) => {
  // todoId는 _id, updatedTodo는 수정사항 반영한 json ("date" 있어야함)
  try {
    const res = await api.patch(`/api/categories/${catId}`, {
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
export const updateTodoCompletedStatus = async (catId, completed, date) => {
  // todoId는 _id, completed는 boolean, date는 YYYY-MM-YY
  try {
    const res = await api.patch(`/api/categories/${catId}/completed`, {
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
export const deleteTodo = async (catId, action, date) => {
  try {
    const res = await api.delete(`/api/categories/${catId}`, {
      action,
      date,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 TODO 삭제 오류:', error);
    throw error;
  }
};
