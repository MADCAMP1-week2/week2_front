import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import { useSchedules } from '@hooks/useSchedules';  // 기존 훅 사용

const { height: SCREEN_H } = Dimensions.get('window');
const HOUR_H = 50;     // 1시간 높이

const ScheduleView = ({ date }) => {
  const { data, isLoading, isError } = useSchedules(date);
  const schedules = Array.isArray(data) ? data : [];
  const scrollY = useSharedValue(0);

  // 현재 시각 Y 위치
  const nowOffset = useMemo(() => {
    const h = dayjs().hour();
    const m = dayjs().minute();
    return (h + m / 60) * HOUR_H;
  }, []);

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const redLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: nowOffset - scrollY.value }],
  }));

  const renderHour = ({ item: hour }) => (
    <View style={styles.hour}>
      <Text style={styles.hourLabel}>{hour}</Text>
      {schedules
        .filter(s => dayjs(s.start).hour() === hour)
        .map(s => (
          <View key={s._id} style={styles.eventBox}>
            <Text numberOfLines={1} style={styles.eventText}>
              {s.title}
            </Text>
          </View>
        ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 위·아래 페이드 */}
      

      <Animated.FlatList
        data={[...Array(24).keys()]}          // 0~23
        keyExtractor={i => String(i)}
        renderItem={renderHour}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SCREEN_H * 0.2 }}
        getItemLayout={(_, i) => ({
          length: HOUR_H,
          offset: HOUR_H * i,
          index: i,
        })}
      />

      <Animated.View style={[styles.nowLine, redLineStyle]} />
      <LinearGradient colors={['#f7f7f7', 'transparent']} style={[styles.fade, { top: 0 }]} />
      <LinearGradient colors={['transparent', '#f7f7f7']} style={[styles.fade, { bottom: 0 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  hour: {
    height: HOUR_H,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#b1b1b1',
    opacity: 0.5,
    justifyContent: 'flex-start',
    paddingLeft: 48,
  },
  hourLabel: { position: 'absolute', left: 8, top: 1, color: '#B1B1B1', opacity: 1, fontSize: 10, fontFamily: 'SCDream-Light' },
  eventBox: {
    position: 'absolute',
    left: 48,
    right: 8,
    top: 4,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#E7D9FF',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  eventText: { fontSize: 12, color: '#4a4a4a' },
  nowLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#ED686A' },
  fade: { position: 'absolute', left: 0, right: 0, height: 32,  pointerEvernts: 'none' },
});

export default ScheduleView;
