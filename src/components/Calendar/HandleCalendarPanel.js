// HandleCalendarPanelPagerView.js — FINAL
// 0.68 RN + Reanimated2 + react‑native‑pager‑view 5.x 호환 버전
// ─────────────────────────────────────────────────────────────────────────────
/* eslint-disable react/react-in-jsx-scope */

import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, unstable_batchedUpdates, InteractionManager } from 'react-native';
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
const H_MIN = 32, H_WEEK = 140, H_NAVI = 65, H_FULL = H;
const CELL_H = 75, H_GAP = 2, V_GAP = 6, ROW_H = CELL_H + V_GAP * 2;
const HANDLE_H = 6, HANDLE_MV = 10; // handle height / marginVert
const TITLE_H = 46, HEADER_H = 20;
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
      columnWrapperStyle={{ justifyContent: 'center', alignContent: 'center' }}
      getItemLayout={(_, i) => ({ length: CELL_H, offset: CELL_H * i, index: i })}
    />
  );
};

/* 공통 훅 ---------------------------------------------------- */
function usePager(centerDate, onDelta, buildPages) {
  const pagerRef = useRef(null);
  const selected = useRef(1);   // 0·1·2 중 선택된 위치
  const locked   = useRef(false);

  const pages = useMemo(() => buildPages(centerDate), [centerDate]);

  /* ① centerDate가 바뀐 즉시(페인트 전) 중앙으로 리셋 */
  useLayoutEffect(() => {
    pagerRef.current?.setPageWithoutAnimation(1);
    locked.current = false;          // 잠금 해제
  }, [centerDate]);

  /* ② 선택된 위치만 저장 */
  const handlePageSelected = e => {
    selected.current = e.nativeEvent.position;
  };

  /* ③ idle 상태 ⇒ delta 계산 → centerDate 업데이트만 */
  const handleScrollStateChanged = e => {
    if (
      e.nativeEvent.pageScrollState !== 'idle' ||
      selected.current === 1 ||
      locked.current
    ) {
      return;
    }
    locked.current = true;
    const delta = selected.current === 0 ? -1 : 1;
    onDelta(delta);
    // 리셋은 ①(useLayoutEffect)에서 실행
  };

  return { pagerRef, pages, handlePageSelected, handleScrollStateChanged };
}

/* MonthPager ------------------------------------------------- */
export function MonthPager({ centerDate, onDelta, progress }) {
  const { pagerRef, pages, handlePageSelected, handleScrollStateChanged } =
    usePager(centerDate, onDelta, buildMonthPages);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      style={{ width: W, flex: 1 }}
      onPageSelected={handlePageSelected}
      onPageScrollStateChanged={handleScrollStateChanged}
    >
      {/* key를 0·1·2로 고정해 불필요한 언마운트 방지 */}
      <View key="0"><CalendarGrid dates={pages.prev}    progress={progress} mode="MONTH" /></View>
      <View key="1"><CalendarGrid dates={pages.current} progress={progress} mode="MONTH" /></View>
      <View key="2"><CalendarGrid dates={pages.next}    progress={progress} mode="MONTH" /></View>
    </PagerView>
  );
}

/* WeekPager -------------------------------------------------- */
export function WeekPager({ centerDate, onDelta, progress }) {
  const { pagerRef, pages, handlePageSelected, handleScrollStateChanged } =
    usePager(centerDate, onDelta, buildWeekPages);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      style={{ width: W, flex: 1 }}
      onPageSelected={handlePageSelected}
      onPageScrollStateChanged={handleScrollStateChanged}
    >
      <View key="0"><CalendarGrid dates={pages.prev}    progress={progress} mode="WEEK" /></View>
      <View key="1"><CalendarGrid dates={pages.current} progress={progress} mode="WEEK" /></View>
      <View key="2"><CalendarGrid dates={pages.next}    progress={progress} mode="WEEK" /></View>
    </PagerView>
  );
}

function getRowIndex(d /* dayjs */) {
  const first = d.startOf('month');
  const offset = (first.day() + 7) % 7;          // 첫째 날이 무슨 요일인지(0=일)
  const n = d.date() + offset - 1;               // 월 머리 공백 포함한 index
  return Math.floor(n / 7);                      // 0 ~ 5
}

// ───────── Main Panel ─────────
export default function HandleCalendarPanel({ y, progress }) {
  const { panelSnap, setSnap } = useHomeUIStore((s) => ({ panelSnap: s.panelSnap, setSnap: s.setSnap }));
  const setVisible = useBottomBarStore((s) => s.setVisible);
  const selectedDate = useHomeUIStore(state => state.selectedDate);
  const [centerDate, setCenterDate] = useState(dayjs(selectedDate));
  useEffect(() => {
    setCenterDate(dayjs(selectedDate));
  }, [selectedDate]);

  // panelSnap 0(MONTH) 0.5(WEEK) 1(MIN)
  const viewMode = panelSnap === 0.5 ? 'WEEK' : 'MONTH';

  // progress (header/grid 애니 전환)

  // panel height 애니메이션 유지
  useEffect(() => {
    y.value = withTiming(SNAP_Y[2 - panelSnap * 2], { duration: 300, easing: Easing.out(Easing.cubic) });
  }, []);

  // 해당 week의 row번째
  const rowIdx = useMemo(() => getRowIndex(centerDate), [centerDate]);

  // header translate
  const headerTranslate = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [0, HEADER_DOWN_MONTH], Extrapolate.CLAMP)
  );
  const headerSt = useAnimatedStyle(() => ({ transform: [{ translateY: headerTranslate.value }] }));

  // title translate
  const titleTranslate = useDerivedValue(() =>
    interpolate(progress.value, [0.25, 0], [0, 1], Extrapolate.CLAMP)
  );
  const titleSt = useAnimatedStyle(() => ({ opacity:  titleTranslate.value }));

  // handle translate
  const handleOpacity = useDerivedValue(() =>
    interpolate(progress.value, [0.25, 0], [1, 0.4], Extrapolate.CLAMP)
  );
  const handleTranslate = useDerivedValue(() =>
    interpolate(progress.value, [0.25, 0], [1, 1.5], Extrapolate.CLAMP)
  );
  const handleSt = useAnimatedStyle(() => ({ opacity:  handleOpacity.value, transform: [{ scaleX: handleTranslate.value }]}));

  // calendar translate
  const monthShift = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [-rowIdx*ROW_H, 0], Extrapolate.CLAMP)
  );

  const monthOpaicity = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [0, 1], Extrapolate.CLAMP)
  );

  const weekShift = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [0, rowIdx*ROW_H], Extrapolate.CLAMP)
  );

  const monthSt = useAnimatedStyle(() => ({
    transform: [{ translateY: monthShift.value }],
    opacity: monthOpaicity.value,
    pointerEvents: monthOpaicity.value < 0.5 ? 'none' : 'auto',
  }));

  const weekSt = useAnimatedStyle(() => ({
    transform: [{ translateY: weekShift.value }],
    opacity: progress.value === 0 ? 0: 1,
    pointerEvents: panelSnap === 0 ? 'none' : 'auto',
  }));

  // mask (grid clip)
  const maskHeight = useDerivedValue(() =>
    interpolate(progress.value, [0.5, 0], [6*ROW_H, 6*ROW_H], Extrapolate.CLAMP)
  );
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
        onStart: (_, ctx) => {  ctx.start = y.value; ctx.start = y.value; },
        onActive: (e, ctx) => { y.value = Math.min(Math.max(ctx.start + e.translationY, SNAP_Y[2]), SNAP_Y[0]); },
        onEnd: () => {
          const dest = snapPoint(y.value, 0, SNAP_Y);
          y.value = withSpring(dest, { damping: 500, stiffness: 300 }, () => runOnJS(setSnap)(PROG[dest === SNAP_Y[0] ? 'MIN' : dest === SNAP_Y[1] ? 'WEEK' : 'MONTH']));
        },
      })
    }>
      <Animated.View style={[styles.sheet, useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }))]}>
        {/* Handle */}
        <Animated.View style={[styles.handleBar, handleSt]} />

        {/* Header Title */}
        <Animated.View style={[styles.header, titleSt]}>
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
          <Animated.View style={[StyleSheet.absoluteFill, monthSt]}>
            <MonthPager
              centerDate={centerDate}
              onDelta={onMonthDelta}
              progress={progress}
            />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, weekSt]}>
            <WeekPager
              centerDate={centerDate}
              onDelta={onWeekDelta}
              progress={progress}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

// ───────── Styles ─────────
const styles = StyleSheet.create({
  sheet: { position: 'absolute', top: 0, left: 0, right: 0, height: H_FULL, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 70 },
  handleBar: { alignSelf: 'center', width: 44, height: 6, borderRadius: 4, backgroundColor: '#dedede', marginVertical: 10 },
  header: { position: 'absolute', top: 10, left: 0, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 36, fontWeight: '600', color: '#222' },
  dayHeader: { position: 'absolute', top: HEADER_TOP_WEEK, left: 0, width: W, height: HEADER_H, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dayLabel: { width: W / 7 - 2, textAlign: 'center', fontSize: 12, fontWeight: '500', fontFamily: 'SCDream-Medium', color: '#959595' },
  sun: { color: '#F08789' },
  sat: { color: '#90ADED' },
  mask: { width: W },
  dayBox: { width: W / 7 - H_GAP * 2 - 2, height: CELL_H, marginHorizontal: H_GAP, marginVertical: V_GAP, justifyContent: 'center', alignItems: 'center', borderRadius: 6},
});