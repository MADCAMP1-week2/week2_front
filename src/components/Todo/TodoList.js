import React from 'react';
import { View, FlatList } from 'react-native';
import { useTodos } from '@hooks/useTodos';
import TodoItem from './TodoItem';

const TodoList = ({ date }) => {
  const { data: todos = [] } = useTodos(date);
  const renderItem = ({ item }) => <TodoItem todo={item} onToggle={() => {}} />;
  return (
    <FlatList
      data={todos}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
};

export default TodoList;