import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedReaction,
  withTiming,
} from 'react-native-reanimated';

import ScheduleView from './Schedule/ScheduleView';
import TodoList from './Todo/TodoList';
import {useHomeUIStore} from '@store/homeUIStore';

const {height: H, width: W} = Dimensions.get('window');

export default function TwoColumnLayout({progress}) {
  const snap = useHomeUIStore(state => state.panelSnap); // 0~1

  /* ❷ SharedValue 하나만 준비 */
  const snapSV = useSharedValue(snap);

  /* ❸ 스토어 값이 바뀌면 UI thread로 스무스하게 전달 */
  useEffect(() => {
    snapSV.value = withTiming(snap, {duration: 200});
  }, [snap]);

  const containerSt = useAnimatedStyle(() => ({
    height: interpolate(snapSV.value, [0, 0.5, 1], [H - 390, H - 390, H - 270]),
  }));

  return (
    <Animated.View style={[styles.container, containerSt]}>
      <View style={styles.schedule}>
        <ScheduleView />
      </View>
      <View style={styles.todo}>
        <TodoList date={'2025-07-16'} projectId={null} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden', // 필요시
  },
  schedule: {
    flex: 3, // 60%
    padding: 4,
  },
  todo: {
    flex: 7, // 40%
    padding: 10,
  },
});
