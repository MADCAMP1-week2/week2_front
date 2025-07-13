// components/Calendar/HandleCalendarPanel.js
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View, Pressable, ScrollView, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { useHomeUIStore } from '@store/homeUIStore';

/* ===== 상수 ===== */
const { height: H, width: W } = Dimensions.get('window');
const H_MIN  = 24;   // 핸들만
const H_WEEK = 160;  // 주간
const H_FULL = H;    // 월간

const SNAP_Y = [H - H_MIN, H - H_WEEK, 0]; // [MIN, WEEK, MONTH]
const PROG   = { MIN: 1, WEEK: 0.5, MONTH: 0 }; // 진행도 0~1

/* ===== 데모용 날짜 박스 ===== */
const DayBox = ({ idx }) => (
  <View style={[styles.dayBox, { backgroundColor: idx % 2 ? '#E4E0FF' : '#F5F3FF' }]}>
    <Text style={styles.dayText}>{idx + 1}</Text>
  </View>
);

/* ===== 메인 컴포넌트 ===== */
export default function HandleCalendarPanel() {
  const { panelSnap, setSnap } = useHomeUIStore(
    s => ({ panelSnap: s.panelSnap, setSnap: s.setSnap })
  );

  /* ---------- 패널 위치 ---------- */
  const y = useSharedValue(SNAP_Y[1]);               // 시작 = WEEK

  /* ---------- 외부 스냅 변경 시 동기화 ---------- */
  useEffect(() => {
    y.value = withSpring(SNAP_Y[2 - panelSnap * 2]); // 1→0,0.5→1,0→2
  }, [panelSnap]);

  /* ---------- 진행도 0(MONTH)~1(MIN) ---------- */
  const progress = useDerivedValue(() =>
    (y.value - SNAP_Y[2]) / (SNAP_Y[0] - SNAP_Y[2])
  );

  /* ---------- 제스처 ---------- */
  const pan = useAnimatedGestureHandler({
    onStart: (_, ctx) => { ctx.start = y.value; },
    onActive: (e, ctx) => { y.value = ctx.start + e.translationY; },
    onEnd: (e) => {
      const dest = snapPoint(y.value, e.velocityY, SNAP_Y);
      y.value = withSpring(dest, { damping: 30, stiffness: 260, overshootClamping: true },
        f => f && runOnJS(setSnap)(PROG[dest === SNAP_Y[0] ? 'MIN' : dest === SNAP_Y[1] ? 'WEEK' : 'MONTH'])
      );
    },
  });

  /* ---------- 스타일 ---------- */
  const sheetSt = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  const handleBarSt = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.25], [0, 1], Extrapolate.CLAMP),
    transform: [{ scaleX: interpolate(progress.value, [0, 0.25], [0.8, 1], Extrapolate.CLAMP) }],
  }));

  const closeBtnSt = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.25], [1, 0], Extrapolate.CLAMP),
  }));

  const weekStripSt = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 0.6, 1], [0, 1, 1, 0], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0, 0.5, 1], [-40, 0, 0]) }],
  }));

  const monthGridSt = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0, 0.5], [0, 40]) }],
  }));

  /* ---------- 렌더 ---------- */
  return (
    <PanGestureHandler onGestureEvent={pan}>
      <Animated.View style={[styles.sheet, sheetSt]}>
        {/* 핸들 ↔ X 버튼 모핑 */}
        <Animated.View style={[styles.handleBar, handleBarSt]} />
        <Animated.View style={[styles.closeBtnWrap, closeBtnSt]}>
          <Pressable onPress={() => setSnap(0)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </Animated.View>

        {/* 주간 스트립 */}
        <Animated.View style={weekStripSt}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {[...Array(3)].map((_, pg) => (
              <View key={pg} style={{ flexDirection: 'row', width: W }}>
                {[...Array(7)].map((_, d) => <DayBox key={d} idx={pg * 7 + d} />)}
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 월간 그리드 */}
        <Animated.View style={[styles.monthGrid, monthGridSt]}>
          {[...Array(6 * 7)].map((_, i) => <DayBox key={i} idx={i} />)}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

/* ===== 스타일 ===== */
const styles = StyleSheet.create({
  sheet: {
    position: 'absolute', left: 0, right: 0, top: 0, height: H_FULL,
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleBar: {
    alignSelf: 'center', width: 44, height: 4, borderRadius: 2,
    backgroundColor: '#bbb', marginVertical: 8,
  },
  closeBtnWrap: { position: 'absolute', right: 12, top: 8 },
  closeText: { fontSize: 18, color: '#666' },
  dayBox: {
    width: W / 7, height: 40, justifyContent: 'center', alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd',
  },
  dayText: { fontSize: 11, color: '#555' },
  monthGrid: { flexWrap: 'wrap', flexDirection: 'row' },
});
