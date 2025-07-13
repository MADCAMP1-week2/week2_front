import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import TopBar from '@components/TopBar/TopBar';
import ScheduleView from '@components/Schedule/ScheduleView';
import TodoList from '@components/Todo/TodoList';
import HandleCalendarPanel from '@components/Calendar/HandleCalendarPanel';
import { useHomeUIStore } from '@store/homeUIStore';

const MainScreen = () => {
  const { selectedDate } = useHomeUIStore();
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <ScheduleView date={selectedDate} />
      <TodoList date={selectedDate} />
      <HandleCalendarPanel />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default MainScreen;