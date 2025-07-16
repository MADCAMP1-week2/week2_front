import api from './index';
import dayjs from 'dayjs';

// 특정 기간 일정 가져오는 GET
export const fetchSchedules = async (start, end, projectId) => {
  // start와 end를 YYYY-MM-DD 형식으로 변환
  const params = {
    start: start,
    end: end,
    ...(projectId != null && projectId !== '' && {projectId}),
    // projectId가 null/undefined가 아닐 때만 추가
  };

  try {
    const res = await api.get('/api/schedules', {params});
    return res.data;
  } catch (error) {
    console.error('🛑 일정 불러오기 오류:', error);
    throw error;
  }
};

// 새로운 일정 등록하는 POST
export const addSchedule = async newSchedule => {
  // newSchedule은 json 형태
  try {
    const res = await api.post('api/schedules', newTodo);
    return res.data;
  } catch (error) {
    console.error('🛑 일정 등록 오류:', error);
    throw error;
  }
};

// 기존 일정 내용 수정하는 PATCH
export const updateSchedule = async (scheduleId, action, updatedSchedule) => {
  // action = "only_this_date" | "from_this_date" | "all"
  // todoId는 _id, updatedTodo는 수정사항 반영한 json ("date" 있어야함)
  if (!action) action = 'only_this_date';
  try {
    const res = await api.patch(`/api/schedules/${scheduleId}`, {
      action,
      updateData: updatedSchedule,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 일정 수정 오류:', error);
    throw error;
  }
};

// 기존 일정 삭제하는 DELETE
export const deleteSchedule = async (scheduleId, action, startDateTime) => {
  try {
    const res = await api.delete(`/api/schedules/${scheduleId}`, {
      action,
      startDateTime,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 일정 삭제 오류:', error);
    throw error;
  }
};
