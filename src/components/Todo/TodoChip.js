import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodoChip = ({ title }) => (
  <View style={styles.chip}>
    <Text style={styles.text} numberOfLines={1}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#dcd6ff',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginVertical: 1,
  },
  text: {
    fontSize: 10,
  },
});

export default TodoChip;