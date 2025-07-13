// components/Calendar/HandleCalendarPanel.js
// ─────────────────────────────────────────────────────────────
// 주간(0.5) → 월간(0) 전환 시, 선택 주가 최상단에 붙어 있으며
// 패널이 늘어나면서 나머지 주가 자연스럽게 드러나는 컴포넌트

import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
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
import { useBottomBarStore } from '@store/bottomBarStore';

/* ── 상수 ─────────────────────────────────────────── */
const { height: H, width: W } = Dimensions.get('window');
const H_MIN = 35; // 핸들만 보이는 상태
const H_WEEK = 150; // 주간 높이
const H_NAVI = 65; // 하단 네비 높이
const H_FULL = H; // 패널 최대 높이
const ROW_H = 80; // DayBox 하나의 높이

const SNAP_Y = [H - H_MIN - H_NAVI, H - H_WEEK - H_NAVI, 0]; // MIN, WEEK, MONTH
const PROG = { MIN: 1, WEEK: 0.5, MONTH: 0 };

/* ── DayBox (demo용) ─────────────────────────────── */
const DayBox = ({ idx }) => (
  <View
    style={[
      styles.dayBox,
      { backgroundColor: idx % 2 ? '#E4E0FF' : '#F5F3FF' },
    ]}
  >
    <Text style={styles.dayText}>{idx + 1}</Text>
  </View>
);

/* ── 메인 패널 ───────────────────────────────────── */
export default function HandleCalendarPanel({ y, progress }) {
  /* 스토어 */
  const { panelSnap, setSnap } = useHomeUIStore((s) => ({
    panelSnap: s.panelSnap,
    setSnap: s.setSnap,
  }));
  const setVisible = useBottomBarStore((s) => s.setVisible);

  const focusedRow = 2; // 0‑base: 3주차가 WeekView에 보임

  /* progress(0.5→0)에 따른 그리드 이동, 마스크 높이 */
  const gridShift = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [-focusedRow * ROW_H, 0]),
  );
  const maskH = useDerivedValue(() =>
    -gridShift.value + ROW_H * 6   // 항상 그리드를 충분히 덮도록
  );

  /* 외부 스냅 ↔ y.value 동기화 + 바텀바 표시 */
  useEffect(() => {
    y.value = withSpring(SNAP_Y[2 - panelSnap * 2]);
    setVisible(panelSnap !== 0);
  }, [panelSnap]);

  /* 제스처 */
  const pan = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (panelSnap === 0) return;
      ctx.start = y.value;
    },
    onActive: (e, ctx) => {
      if (panelSnap === 0) return;
      const next = ctx.start + e.translationY;
      y.value = Math.max(Math.min(next, SNAP_Y[0]), SNAP_Y[2]);
    },
    onEnd: (e) => {
      if (panelSnap === 0) return;
      const dest = snapPoint(y.value, e.velocityY, SNAP_Y);
      y.value = withSpring(dest, { damping: 45, stiffness: 190 }, () => {
        runOnJS(setSnap)(
          PROG[
            dest === SNAP_Y[0]
              ? 'MIN'
              : dest === SNAP_Y[1]
              ? 'WEEK'
              : 'MONTH'
          ],
        );
      });
    },
  });

  /* Animated 스타일 */
  const sheetSt = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
      borderTopLeftRadius: interpolate(
      progress.value,
      [0.25, 0],
      [20, 0],
      Extrapolate.CLAMP
    ),
    borderTopRightRadius: interpolate(
      progress.value,
      [0.25, 0],
      [20, 0],
      Extrapolate.CLAMP
    ),
  }));
  const handleBarSt = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.25], [0, 1],Extrapolate.CLAMP),
    transform: [
      { scaleX: interpolate(progress.value, [0, 0.25], [0.5, 1],Extrapolate.CLAMP) },
    ],
  }));
  const closeBtnSt = useAnimatedStyle(() => ({
    opacity: withDelay(
      200,
      withTiming(interpolate(progress.value, [0, 0.25], [1, 0],Extrapolate.CLAMP)),
    ),
  }));
  const gridSt = useAnimatedStyle(() => ({
    transform: [{ translateY: gridShift.value }],
  }));
  const maskSt = useAnimatedStyle(() => ({
    height: maskH.value,
    overflow: 'hidden',
  }));

  /* 닫기(주간 복귀) 버튼 */
  const handleExit = () => {
    if (panelSnap === 0) setSnap(0.5);
  };

  /* ─────────── 렌더 ─────────── */
  return (
    <PanGestureHandler onGestureEvent={pan} activeOffsetY={[-25, 25]}>
      <Animated.View style={[styles.sheet, sheetSt]}>
        {/* 드래그 바 + 닫기 */}
        <Animated.View style={[styles.handleBar, handleBarSt]} />
        <Animated.View style={[styles.closeBtnWrap, closeBtnSt]}>
          <TouchableOpacity onPress={handleExit}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Week→Month 그리드 */}
        <Animated.View style={[styles.mask, maskSt]}>
          <Animated.View style={[styles.monthGrid, gridSt]}>
            {[...Array(6)].map((_, row) => (
              <View key={row} style={styles.row}>
                {[...Array(7)].map((_, col) => (
                  <DayBox key={col} idx={row * 7 + col} />
                ))}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

/* ── 스타일 ────────────────────────────────────── */
const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: H_FULL,
    backgroundColor: '#fff',
    borderColor: '#eaeaea',
    borderWidth: 1,
    overflow: 'hidden',
  },
  handleBar: {
    alignSelf: 'center',
    width: 44,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginVertical: 10,
  },
  closeBtnWrap: { position: 'absolute', right: 12, top: 8 },
  closeText: { fontSize: 18, color: '#666' },

  dayBox: {
    width: W / 7,
    height: ROW_H,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  dayText: { fontSize: 11, color: '#555' },

  mask: { width: W },
  monthGrid: { flexDirection: 'column' },
  row: { flexDirection: 'row', height: ROW_H },
});
