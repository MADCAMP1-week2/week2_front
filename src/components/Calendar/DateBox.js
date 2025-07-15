import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { useHomeUIStore } from '@store/homeUIStore';
import dayjs from 'dayjs';
import { selectedDateKey } from './shared';

export default function DayBox({ date, inMonth, style }) {
  const { setDate } = useHomeUIStore();
  const key = date.format('YYYY-MM-DD');
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(0);

  useDerivedValue(() => {
    scale.value = withTiming(selectedDateKey.value === key ? 1.15 : 1, { duration: 150 });
    borderWidth.value = withTiming(selectedDateKey.value === key ? 1 : 0, { duration: 150 });
  });  

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value
  }));

  // 요일 색상 처리
  const dayOfWeek = date.day();
  let color = '#000';
  if (dayOfWeek === 0) color = inMonth ? '#ED686A' : '#F08789';
  else if (dayOfWeek === 6) color = inMonth ? '#5988EE' : '#90ADED';
  else color = inMonth ? '#262626' : '#959595';

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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#f3f3f3ff'
  },
  dayText: {
    position: 'absolute',
    top: 10,
    fontSize: 12,
    fontFamily: 'SCDream-Medium'
  },
});
