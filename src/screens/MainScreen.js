import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TopBar from '@components/TopBar/TopBar';
import ScheduleView from '@components/Schedule/ScheduleView';
import TodoList from '@components/Todo/TodoList';
import HandleCalendarPanel from '@components/Calendar/HandleCalendarPanel';
import HandleCalendarDemo from '../components/Calendar/HandleCalendarDemo';
import { useHomeUIStore } from '@store/homeUIStore';

const MainScreen = () => {
  const { selectedDate } = useHomeUIStore();
  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤 배경 dim/scale은 패널에서 제어 */}
      <TopBar />
      {/* <ScheduleView date={selectedDate} />
      <TodoList date={selectedDate} />
      <HandleCalendarPanel /> */}
      <HandleCalendarDemo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default MainScreen;
