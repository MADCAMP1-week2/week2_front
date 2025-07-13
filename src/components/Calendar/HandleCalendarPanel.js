import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { clamp } from 'react-native-redash';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useHomeUIStore } from '@store/homeUIStore';
import WeeklyStrip from './WeeklyStrip';
import MonthlyCalendar from './MonthlyCalendar';

const SNAP_MIN = 0;
const SNAP_WEEK = 0.5;
const SNAP_MONTH = 1;
const MAX_UP   = SCREEN_H - PANEL_H_MONTH;  // 가장 위
const MAX_DOWN = SCREEN_H - PANEL_H_MIN;    // 가장 아래

const { height: SCREEN_H } = Dimensions.get('window');
const PANEL_H_MIN = 24;
const PANEL_H_WEEK = 160;
const PANEL_H_MONTH = SCREEN_H;

const heightFor = snap => {
  if (snap === SNAP_MIN) return PANEL_H_MIN;
  if (snap === SNAP_WEEK) return PANEL_H_WEEK;
  return PANEL_H_MONTH;
};

const HandleCalendarPanel = () => {
  const { panelSnap, setSnap } = useHomeUIStore();
  const translateY = useSharedValue(SCREEN_H - heightFor(panelSnap));

  // 첫 위치 동기화
  useEffect(() => {
    translateY.value = SCREEN_H - heightFor(panelSnap);
  }, [panelSnap]);

  const gesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => (ctx.startY = translateY.value),
    onActive: (e, ctx) => (translateY.value = clamp(ctx.startY + e.translationY, MAX_UP, MAX_DOWN)),
    onEnd: () => {
      // 0~1 비율
      const ratio = 1 - translateY.value / (SCREEN_H - PANEL_H_MIN);
      let snap = SNAP_MIN;
      if (ratio < 0.25) snap = SNAP_MIN;
      else if (ratio < 0.75) snap = SNAP_WEEK;
      else snap = SNAP_MONTH;

      const target = SCREEN_H - heightFor(snap);

      translateY.value = withSpring(          // ✅ 애니메이션 **끝난 뒤** 상태 변경
        target,
        { damping: 15 },
        finished => {
          if (finished) runOnJS(setSnap)(snap);
        },
      );
    },
  });

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const r = 1 - translateY.value / (SCREEN_H - PANEL_H_MIN); // 0→1
    return {
      opacity: interpolate(r, [0.5, 1], [0, 0.35], Extrapolate.CLAMP),
      transform: [{ scale: interpolate(r, [0.5, 1], [1, 0.95], Extrapolate.CLAMP) }],
    };
  });

  return (
    <>
      {/* 뒤 배경 딤 & 축소 */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, backdropStyle, { backgroundColor: '#000' }]}
      />

      <PanGestureHandler onGestureEvent={gesture}>
        <Animated.View style={[styles.sheet, panelStyle]}>
          {panelSnap === SNAP_MONTH ? (
            <Pressable style={styles.closeBtn} onPress={() => setSnap(SNAP_MIN)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          ) : (
            <View style={styles.handleBar} />
          )}

          {panelSnap === SNAP_MONTH ? <MonthlyCalendar /> : <WeeklyStrip />}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PANEL_H_MONTH,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 12 },
  closeText: { fontSize: 18 },
});

export default HandleCalendarPanel;
