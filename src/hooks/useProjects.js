import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMyProject,
  addProject as addProjectAPI,
  updateProject as updateProjectAPI,
  updateProjectMember as updateProjectMemberAPI,
  updateProjectOwner as updateProjectOwnerAPI,
  deleteProject as deleteProjectAPI,
} from '../api/project'; // 경로 수정 필요


// 프로젝트 목록 조회 (내가 속한 모든 프로젝트)
export const useMyProjects = () => {
  return useQuery({
    queryKey: ['myProjects'],
    queryFn: fetchMyProject,
    staleTime: 1000 * 60 * 5,
  });
};

// 프로젝트 생성
export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['myProjects']);
    },
  });
};

// 프로젝트 수정 (name, description, isActive)
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, updatedProject }) =>
      updateProjectAPI(projectId, updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProjects']);
    },
  });
};

// 프로젝트 멤버 수정
export const useUpdateProjectMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, updatedMembers }) =>
      updateProjectMemberAPI(projectId, updatedMembers),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProjects']);
    },
  });
};

// 프로젝트 오너 변경
export const useUpdateProjectOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, newOwnerId }) =>
      updateProjectOwnerAPI(projectId, newOwnerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProjects']);
    },
  });
};

// 프로젝트 삭제
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId) => deleteProjectAPI(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myProjects']);
    },
  });
};
