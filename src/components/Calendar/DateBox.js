import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import dayjs from 'dayjs';
import { useHomeUIStore } from '@store/homeUIStore';

export default function DayBox({ date }) {
  const todayDate = useHomeUIStore(state => state.todayDate);
  const selectedDate = useHomeUIStore(state => state.selectedDate);

  const isToday = dayjs(date).isSame(todayDate, 'day');
  const isSelected = dayjs(date).isSame(selectedDate, 'day');

  return (
    <View
      style={[
        styles.dayBox,
        {
          backgroundColor: isSelected
            ? '#E4E0FF'
            : isToday
            ? '#FFEFD6'
            : date.getDate() % 2 === 0
            ? '#E4E0FF'
            : '#F5F3FF',
        },
      ]}
    >
      <Text style={styles.dayText}>{date.getDate()}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  dayBox: {
    flex: 1,
    aspectRatio: 1, // 정사각형
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selected: {
    backgroundColor: '#E4E0FF',
  },
  today: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  outOfMonth: {
    opacity: 0.3,
  },
});