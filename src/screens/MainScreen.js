import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View } from 'react-native';
import Animated, { useSharedValue, useDerivedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import TopBar from '@components/TopBar/TopBar';
import ScheduleView from '@components/Schedule/ScheduleView';
import TodoList from '@components/Todo/TodoList';
import HandleCalendarPanel from '@components/Calendar/HandleCalendarPanel';
import HandleCalendarDemo from '@components/Calendar/HandleCalendarDemo';
import { useHomeUIStore } from '@store/homeUIStore';


const MainScreen = () => {
  const y = useSharedValue(0); // or default to SNAP_Y[1]
  const H = Dimensions.get('window').height;
  const SNAP_Y = [H - 24, H - 160, 0];

  const progress = useDerivedValue(() =>
    interpolate(
      y.value,
      [SNAP_Y[2], SNAP_Y[1], SNAP_Y[0]], // MONTH → WEEK → MIN
      [0,         0.5,       1],
      Extrapolate.CLAMP
    )
  );
  const { selectedDate } = useHomeUIStore();
  return (
    <View style={{ flex: 1 }}>
    {/* 배경 레이어 */}
    <LinearGradient
      colors={['#ffffff', '#f7f7f7', '#f7f7f7', '#f7f7f7', '#f7f7f7']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
    
    {/* 컨텐츠 레이어 */}
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />
      {/* Your components */}
      <HandleCalendarDemo y={y} progress={progress} />
    </SafeAreaView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default MainScreen;
