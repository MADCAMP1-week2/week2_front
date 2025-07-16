import api from './index';

// 프로젝트 생성하는 POST
export const addProject = async newProject => {
  // newProject는 json 형태
  try {
    const res = await api.post('api/projects', newProject);
    return res.data;
  } catch (error) {
    console.error('🛑 프로젝트 생성 오류:', error);
    throw error;
  }
};

// 자기가 참여한 프로젝트 목록 조회
export const fetchMyProject = async () => {
  try {
    const res = await api.get('api/projects');
    return res.data;
  } catch (error) {
    console.error('🛑 내 프로젝트 조회 오류:', error);
    throw error;
  }
};

// 프로젝트 수정 (오너만 수정 가능)
export const updateProject = async (projectId, updatedProject) => {
  // projectId는 _id, updatedProject는 수정사항 반영한 json (name, description, isActive)
  try {
    const res = await api.patch(`/api/projects/${projectId}`, updatedProject);
    return res.data;
  } catch (error) {
    console.error('🛑 프로젝트 수정 오류:', error);
    throw error;
  }
};

// 프로젝트 멤버 수정 (멤버만 수정 가능)
export const updateProjectMember = async (projectId, updatedMembers) => {
  // projectId는 _id, updatedMembers는 변경사항 반영한 member 배열
  try {
    const res = await api.patch(`/api/projects/${projectId}/members`, {
      members: updatedMembers,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 프로젝트 멤버 수정 오류:', error);
    throw error;
  }
};

// 프로젝트 오너 수정 (오너만 수정 가능)
export const updateProjectOwner = async (projectId, newOwnerId) => {
  // projectId는 _id, newOwnerId는 string (_id)
  try {
    const res = await api.patch(`/api/projects/${projectId}/owner`, {
      newOwnerId: newOwnerId,
    });
    return res.data;
  } catch (error) {
    console.error('🛑 프로젝트 오너 수정 오류:', error);
    throw error;
  }
};

// 프로젝트 삭제 (오너만 삭제 가능)
export const deleteProject = async projectId => {
  // projectId는 _id
  try {
    const res = await api.delete(`/api/projects/${projectId}`);
    return res.data;
  } catch (error) {
    console.error('🛑 프로젝트 삭제 오류:', error);
    throw error;
  }
};
