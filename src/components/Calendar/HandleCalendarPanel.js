// HandleCalendarPanelPagerView.js — FINAL
// 0.68 RN + Reanimated2 + react‑native‑pager‑view 5.x 호환 버전
// ─────────────────────────────────────────────────────────────────────────────
/* eslint-disable react/react-in-jsx-scope */

import React, { useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, unstable_batchedUpdates } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
  Easing,
  set,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import dayjs from 'dayjs';

import { useHomeUIStore } from '@store/homeUIStore';
import { useBottomBarStore } from '@store/bottomBarStore';
import { generateCalendarDates } from '@services/generateCalendarDates';
import DayBox from './DateBox';

// ───────── Layout Const ─────────
const { height: H, width: W } = Dimensions.get('window');
const H_MIN = 32, H_WEEK = 150, H_NAVI = 65, H_FULL = H;
const CELL_H = 75, H_GAP = 2, V_GAP = 7, ROW_H = CELL_H + V_GAP * 2;
const HANDLE_H = 6, HANDLE_MV = 10; // handle height / marginVert
const TITLE_H = 46, HEADER_H = 25;
const HEADER_TOP_WEEK = HANDLE_H + HANDLE_MV * 2 + TITLE_H - 46;
const HEADER_DOWN_MONTH = 40, GRID_GAP = 2;
const SNAP_Y = [H - H_MIN - H_NAVI, H - H_WEEK - H_NAVI, 0];
const PROG = { MIN: 1, WEEK: 0.5, MONTH: 0 };

// ───────── Helpers ─────────
function buildMonthPages(center) {
  const base = center.startOf('month');
  return {
    prev: generateCalendarDates(base.subtract(1, 'month'), 'MONTH'),
    current: generateCalendarDates(base, 'MONTH'),
    next: generateCalendarDates(base.add(1, 'month'), 'MONTH'),
  };
}
function buildWeekPages(center) {
  const base = center.startOf('week');
  return {
    prev: generateCalendarDates(base.subtract(1, 'week'), 'WEEK'),
    current: generateCalendarDates(base, 'WEEK'),
    next: generateCalendarDates(base.add(1, 'week'), 'WEEK'),
  };
}

// ───────── 공통 페이지 컴포넌트 (FlatList 7열) ─────────
import { FlatList } from 'react-native';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
function CalendarGrid({ dates, progress, mode }) {
  const focusedRow = mode === 'WEEK' ? 0 : 2; // 월→ROW3, 주→ROW0(단일)
  const gridShift = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [mode === 'WEEK' ? 0 : -focusedRow * ROW_H, 0], Extrapolate.CLAMP)
  );
  const gridAnim = useAnimatedStyle(() => ({ transform: [{ translateY: gridShift.value }] }));

  const renderItem = ({ item }) => (
    <DayBox
      date={item}
      inMonth={mode === 'MONTH' ? item.month() === dates[15].month() : true}
      style={styles.dayBox}
    />
  );

  return (
    <AnimatedFlatList
      data={dates}
      keyExtractor={(d) => d.format('YYYY-MM-DD')}
      numColumns={7}
      scrollEnabled={false}
      renderItem={renderItem}
      columnWrapperStyle={{ justifyContent: 'center' }}
      contentContainerStyle={gridAnim}
      getItemLayout={(_, i) => ({ length: CELL_H, offset: CELL_H * i, index: i })}
    />
  );
}

// ───────── Pager 래퍼들 ─────────
function MonthPager({ centerDate, onDelta, progress }) {
  const pagerRef = React.useRef(null);       // ① 내부 ref
  const isTurning = React.useRef(false);     // ② 중복 이벤트 방지

  // ③ centerDate 바뀌면 한 프레임 뒤 중앙 페이지로 리셋
  useEffect(() => {
    requestAnimationFrame(() => {
      isTurning.current = false;
    });
  }, [centerDate]);

  const pages = useMemo(() => buildMonthPages(centerDate), [centerDate]);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      style={{ width: W, flex: 1 }}
      onPageSelected={e => {
        const pos = e.nativeEvent.position;
        if (pos === 1 || isTurning.current) return;   // 중앙이거나 이미 처리 중이면 무시
        isTurning.current = true;                     // 잠금 
        unstable_batchedUpdates(()=>{
          pagerRef.current?.setPageWithoutAnimation(1); 
          onDelta(pos === 0 ? -1 : 1);
        })
      }}
    >
      <View key="0"><CalendarGrid dates={pages.prev}    progress={progress} mode="MONTH" /></View>
      <View key="1"><CalendarGrid dates={pages.current} progress={progress} mode="MONTH" /></View>
      <View key="2"><CalendarGrid dates={pages.next}    progress={progress} mode="MONTH" /></View>
    </PagerView>
  );
}

function WeekPager({ centerDate, onDelta, progress }) {
  const pagerRef  = React.useRef(null);
  const isTurning = React.useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      pagerRef.current?.setPageWithoutAnimation(1);
      isTurning.current = false;
    });
  }, [centerDate]);

  const pages = useMemo(() => buildWeekPages(centerDate), [centerDate]);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      style={{ width: W, flex: 1 }}
      onPageSelected={e => {
        const pos = e.nativeEvent.position;
        if (pos === 1 || isTurning.current) return;
        isTurning.current = true;
        onDelta(pos === 0 ? -1 : 1);
      }}
    >
      <View key="0"><CalendarGrid dates={pages.prev}    progress={progress} mode="WEEK" /></View>
      <View key="1"><CalendarGrid dates={pages.current} progress={progress} mode="WEEK" /></View>
      <View key="2"><CalendarGrid dates={pages.next}    progress={progress} mode="WEEK" /></View>
    </PagerView>
  );
}


// ───────── Main Panel ─────────
export default function HandleCalendarPanel({ y }) {
  const { panelSnap, setSnap } = useHomeUIStore((s) => ({ panelSnap: s.panelSnap, setSnap: s.setSnap }));
  const setVisible = useBottomBarStore((s) => s.setVisible);
  const [centerDate, setCenterDate] = useState(dayjs());

  // panelSnap 0(MONTH) 0.5(WEEK) 1(MIN)
  const viewMode = panelSnap === 0.5 ? 'WEEK' : 'MONTH';

  // progress (header/grid 애니 전환)
  const progress = useDerivedValue(() =>
    interpolate(y.value, [SNAP_Y[2], SNAP_Y[1], SNAP_Y[0]], [0, 0.5, 1], Extrapolate.CLAMP)
  );

  // panel height 애니메이션 유지
  useEffect(() => {
    y.value = withTiming(SNAP_Y[2 - panelSnap * 2], { duration: 300, easing: Easing.out(Easing.cubic) });
    setVisible(panelSnap !== 0);
  }, [panelSnap]);

  // header translate
  const headerTranslate = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [0, HEADER_DOWN_MONTH], Extrapolate.CLAMP)
  );
  const headerSt = useAnimatedStyle(() => ({ transform: [{ translateY: headerTranslate.value }] }));

  // mask (grid clip)
  const rows = viewMode === 'MONTH' ? 6 : 1;
  const maskHeight = useDerivedValue(() => withTiming(rows * ROW_H, { duration: 300 }));
  const maskSt = useAnimatedStyle(() => ({
    marginTop: HEADER_H + GRID_GAP + headerTranslate.value,
    height: maskHeight.value,
    overflow: 'hidden',
  }));

  const onMonthDelta = (d) => setCenterDate((prev) => prev.add(d, 'month'));
  const onWeekDelta = (d) => setCenterDate((prev) => prev.add(d, 'week'));

  // ───────── Render ─────────
  return (
    <PanGestureHandler activeOffsetY={[-25, 25]} onGestureEvent={
      useAnimatedGestureHandler({
        onStart: (_, ctx) => { ctx.start = y.value; },
        onActive: (e, ctx) => { y.value = Math.min(Math.max(ctx.start + e.translationY, SNAP_Y[2]), SNAP_Y[0]); },
        onEnd: () => {
          const dest = snapPoint(y.value, 0, SNAP_Y);
          y.value = withSpring(dest, { damping: 500, stiffness: 300 }, () => runOnJS(setSnap)(PROG[dest === SNAP_Y[0] ? 'MIN' : dest === SNAP_Y[1] ? 'WEEK' : 'MONTH']));
        },
      })
    }>
      <Animated.View style={[styles.sheet, useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }))]}>
        {/* Handle */}
        <View style={styles.handleBar} />

        {/* Header Title */}
        <Animated.View style={[styles.header, headerSt]}>
          <Text style={styles.title}>{centerDate.month() + 1}</Text>
        </Animated.View>

        {/* 요일 라벨 */}
        <Animated.View style={[styles.dayHeader, headerSt]}>
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <Text key={i} style={[styles.dayLabel, i === 0 && styles.sun, i === 6 && styles.sat]}>{d}</Text>
          ))}
        </Animated.View>

        {/* MASK + Pager */}
        <Animated.View style={[styles.mask, maskSt]}>
          {viewMode === 'MONTH' ? (
            <MonthPager centerDate={centerDate} onDelta={onMonthDelta} progress={progress} />
          ) : (
            <WeekPager centerDate={centerDate} onDelta={onWeekDelta} progress={progress} />
          )}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

// ───────── Styles ─────────
const styles = StyleSheet.create({
  sheet: { position: 'absolute', top: 0, left: 0, right: 0, height: H_FULL, backgroundColor: '#fff' },
  handleBar: { alignSelf: 'center', width: 44, height: 6, borderRadius: 4, backgroundColor: '#bbb', marginVertical: 10 },
  header: { position: 'absolute', top: 10, left: 0, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 36, fontWeight: '600', color: '#222' },
  dayHeader: { position: 'absolute', top: HEADER_TOP_WEEK, left: 0, width: W, height: HEADER_H, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dayLabel: { width: W / 7 - 2, textAlign: 'center', fontSize: 12, fontWeight: '500', color: '#444' },
  sun: { color: '#D33' },
  sat: { color: '#36C' },
  mask: { width: W },
  dayBox: { width: W / 7 - H_GAP * 2 - 2, height: CELL_H, marginHorizontal: H_GAP, marginVertical: V_GAP, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
});