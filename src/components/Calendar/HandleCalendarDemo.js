// components/Calendar/HandleCalendarPanel.js
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View, Pressable, ScrollView, Text, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { useHomeUIStore } from '@store/homeUIStore';
import { useBottomBarStore } from '../../store/bottomBarStore';

/* ===== 상수 ===== */
const { height: H, width: W } = Dimensions.get('window');
const H_MIN  = 35;   // 핸들만
const H_WEEK = 150;  // 주간
const H_FULL = H;    // 월간
const H_NAVI = 65;

const SNAP_Y = [H - H_MIN- H_NAVI, H - H_WEEK - H_NAVI, 0]; // [MIN, WEEK, MONTH]
const PROG   = { MIN: 1, WEEK: 0.5, MONTH: 0 }; // 진행도 0~1

/* ===== 데모용 날짜 박스 ===== */
const DayBox = ({ idx }) => (
  <View style={[styles.dayBox, { backgroundColor: idx % 2 ? '#E4E0FF' : '#F5F3FF' }]}>
    <Text style={styles.dayText}>{idx + 1}</Text>
  </View>
);

/* ===== 메인 컴포넌트 ===== */
export default function HandleCalendarPanel({ y, progress }) {
  const { panelSnap, setSnap } = useHomeUIStore(
    s => ({ panelSnap: s.panelSnap, setSnap: s.setSnap })
  );
  const setVisible = useBottomBarStore(s => s.setVisible);


  /* ---------- 외부 스냅 변경 시 동기화 ---------- */
  useEffect(() => {
    y.value = withSpring(SNAP_Y[2 - panelSnap * 2]);
    if (panelSnap === 0) {
      setVisible(false);
    } else {
      setVisible(true); // 다시 보이게
    }
  }, [panelSnap]);


  /* ---------- 제스처 ---------- */
  const pan = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (panelSnap === 0) return; // ⛔ 패널 고정 시 시작도 무시
      ctx.start = y.value;
    },
    onActive: (e, ctx) => {
      if (panelSnap === 0) return;
      const nextY = ctx.start + e.translationY;
      y.value = Math.max(Math.min(nextY, SNAP_Y[0]), SNAP_Y[2]); },
    onEnd: (e) => {
      if (panelSnap === 0) return;
      const dest = snapPoint(y.value, e.velocityY, SNAP_Y);
      y.value = withSpring(dest, { damping: 45, stiffness: 190, overshootClamping: true },
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
    transform: [{ scaleX: interpolate(progress.value, [0, 0.25], [0.5, 1], Extrapolate.CLAMP) }],
  }));

  const closeBtnSt = useAnimatedStyle(() => {
    const delayedOpacity = withDelay(
      200, // 밀리초 단위, 예: 200ms 뒤에 시작
      withTiming(interpolate(progress.value, [0, 0.25], [1, 0], Extrapolate.CLAMP))
    );
    return {
      opacity: delayedOpacity,
    };
  });

  const handleExit = () => {
  if (panelSnap === 0) {
    setSnap(0.5);
  }
};


  /* ---------- 렌더 ---------- */
  return (
    <PanGestureHandler
      onGestureEvent={pan}
      activeOffsetY={[-25, 25]}
    >
      <Animated.View style={[styles.sheet, sheetSt]}>
        {/* 핸들 ↔ X 버튼 모핑 */}
        <Animated.View style={[styles.handleBar, handleBarSt]} />
        <Animated.View style={[styles.closeBtnWrap, closeBtnSt]}>
          <TouchableOpacity onPress={handleExit}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

/* ===== 스타일 ===== */
const styles = StyleSheet.create({
  sheet: {
    position: 'absolute', left: 0, right: 0, top: 0, height: H_FULL,
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 20,
    borderColor: "#eaeaea", borderWidth: 1,
    overflow: 'hidden',
  },
  handleBar: {
    alignSelf: 'center', width: 44, height: 6, borderRadius: 4,
    backgroundColor: '#bbb', marginVertical: 10,
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
