import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {useTodos} from '@hooks/useTodos';
import TodoItem from './TodoItem';
import { useHomeUIStore } from '@store/homeUIStore';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko'); // 한글 요일

const TodoList = ({date, projectId}) => {
  const {data: todos = []} = useTodos(date, projectId);
  const renderItem = ({item}) => <TodoItem todo={item} onToggle={() => {item.completed = !item.completed}} />;
  const selectedDate = useHomeUIStore(state => state.selectedDate);
  const formattedDate = dayjs(selectedDate).format('M.D.(dd)');
  return (
    <FlatList
      data={todos}
      keyExtractor={item => item._id.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <Text style={{ 
          fontSize: 13, 
          color: "#6f6f6fff", 
          marginBottom: 5,
          left: 10,
          fontFamily: 'SCDream-Bold' 
        }}>
          {formattedDate}
        </Text>
      }
      contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 15 }}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eeeeee',
    borderRadius: 23,
  },
});

export default TodoList;
