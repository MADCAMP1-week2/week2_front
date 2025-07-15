import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useHomeUIStore } from '@store/homeUIStore';
import dayjs from 'dayjs';
import { selectedDateKey } from './shared';

export default function DayBox({ date, inMonth, style }) {
  const { setDate } = useHomeUIStore();
  const key = date.format('YYYY-MM-DD');

  const isSelected = useDerivedValue(() => selectedDateKey.value === key);

  const animatedStyle = useAnimatedStyle(() => {
    const selected = isSelected.value;
    return {
      
      transform: [
        {
          scale: withTiming(selected ? 1.15 : 1, { duration: 100 }),
        },
      ],
      shadowColor: '#000',
      shadowOpacity: withTiming(selected ? 0.25 : 0, { duration: 100 }),
      shadowRadius: withTiming(selected ? 4 : 0, { duration: 100 }),
      elevation: withTiming(selected ? 5 : 0, { duration: 100 }),

      zIndex: selected ? 1 : 0,
    };
  });

  // 요일 색상 처리
  const dayOfWeek = date.day();
  let color = '#000';
  if (dayOfWeek === 0) color = inMonth ? '#D33' : '#fbb';
  else if (dayOfWeek === 6) color = inMonth ? '#36C' : '#aad';
  else color = inMonth ? '#000' : '#888';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        selectedDateKey.value = key;
        setDate(date.toDate());
      }}
    >
      <View style={style}>
        <Animated.View style={[styles.inner, animatedStyle]}>
          <Text style={[styles.dayText, { color }]}>{date.date()}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
