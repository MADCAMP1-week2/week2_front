import React, {useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import {useMyProjects} from '../hooks/useProjects';

const ProjectScreen = () => {
  const {data: projects, isLoading, isError, error} = useMyProjects();
  useEffect(() => {
    if (projects) {
      console.log('📦 프로젝트 목록:', projects);
    }
  }, [projects]);

  if (isLoading) {
    return (
      <View>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>에러 발생: {error?.message}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>프로젝트 수: {projects.length}</Text>
      {/* 목록 출력용 예시 */}
      {projects.map(p => (
        <Text key={p._id}>• {p.name}</Text>
      ))}
    </View>
  );
};

export default ProjectScreen;
