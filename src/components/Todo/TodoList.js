import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useTodos} from '@hooks/useTodos';
import TodoItem from './TodoItem';

const TodoList = ({date, projectId}) => {
  const {data: todos = []} = useTodos(date, projectId);
  const renderItem = ({item}) => <TodoItem todo={item} onToggle={() => {}} />;
  return (
    <FlatList
      data={todos}
      keyExtractor={item => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{paddingHorizontal: 16}}
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
