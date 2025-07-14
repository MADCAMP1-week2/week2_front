import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedReaction,
  withTiming
} from 'react-native-reanimated';

import ScheduleView from './Schedule/ScheduleView';
import TodoList from './Todo/TodoList';
import { useHomeUIStore } from '@store/homeUIStore'

export default function TwoColumnLayout({ progress }) {
  const snap = useHomeUIStore(state => state.panelSnap);  // 0~1

  /* ❷ SharedValue 하나만 준비 */
  const snapSV = useSharedValue(snap);

  /* ❸ 스토어 값이 바뀌면 UI thread로 스무스하게 전달 */
  useEffect(() => {
    snapSV.value = withTiming(snap, { duration: 200 });
  }, [snap]);


  const containerSt = useAnimatedStyle(() => ({
  height: interpolate(snapSV.value, [0, 0.5, 1], [360, 360, 475]),
}));

  return (
      <Animated.View style={[styles.container, containerSt]}>
        <View style={styles.schedule}>
          <ScheduleView />
        </View>
        <View style={styles.todo}>
          <TodoList />
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
    padding: 7, 
  },
  todo: {
    flex: 7, // 40%
    padding: 7, 
  },
});
