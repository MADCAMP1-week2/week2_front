import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScheduleBlock = ({ item }) => {
  const { name, startTime, endTime } = item;
  return (
    <View style={styles.block}>
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.time}>{`${startTime} - ${endTime}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#dcd6ff',
    padding: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  text: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#555',
  },
});

export default ScheduleBlock;