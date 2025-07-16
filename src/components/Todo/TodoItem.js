import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const TodoItem = ({ todo, onToggle }) => (
  <Pressable style={styles.item} onPress={() => onToggle(todo._id)}>
    <Text style={[styles.title, todo.completed && styles.completed]}>{todo.title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginVertical: 4,
  },
  title: {
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});

export default TodoItem;
