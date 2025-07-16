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
import { useModalStore } from '@store/modalStore';

export default function DayBox({ date, inMonth, style }) {
  const { setDate } = useHomeUIStore();
  const key = date.format('YYYY-MM-DD');
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(0);

  const isSelected = useDerivedValue(() => selectedDateKey.value === key);

  useDerivedValue(() => {
    scale.value = withTiming(isSelected.value ? 1.15 : 1, { duration: 150 });
    borderWidth.value = withTiming(isSelected.value ? 1 : 0, { duration: 150 });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value
  }));

  const handlePress = () => {
    const showDateModal = useModalStore.getState().showDateModal;
    if (isSelected.value) {
      // 같은 날짜를 다시 누르면 모달 표시
      console.log("ddd");
      showDateModal(key); 
    } else {
      // 날짜 선택
      selectedDateKey.value = key;
      setDate(date.toDate()); // UI 상태도 업데이트 (optional)
    }
  };

  // 요일 색상 처리
  const dayOfWeek = date.day();
  let color = '#000';
  if (dayOfWeek === 0) color = inMonth ? '#ED686A' : '#F08789';
  else if (dayOfWeek === 6) color = inMonth ? '#5988EE' : '#90ADED';
  else color = inMonth ? '#262626' : '#959595';

  let backgroundColor = dayjs(date).isSame(dayjs(), 'day') ? '#fafafaff' : '#ffffff';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
    >
      <View style={style}>
        <Animated.View style={[styles.inner, animatedStyle ,{backgroundColor}]}>
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
    borderColor: '#f3f3f3ff'
  },
  dayText: {
    position: 'absolute',
    top: 10,
    fontSize: 12,
    fontFamily: 'SCDream-Medium'
  },
});
