import React, {useEffect} from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View, Text } from 'react-native';
import Animated, { useSharedValue, useDerivedValue, interpolate, Extrapolate, useAnimatedStyle } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import TopBar from '@components/TopBar/TopBar';
import ScheduleView from '@components/Schedule/ScheduleView';
import TodoList from '@components/Todo/TodoList';
import HandleCalendarPanel from '@components/Calendar/HandleCalendarPanel';
import { useHomeUIStore } from '@store/homeUIStore';
import TwoColumnLayout from '@components/TwoColumnLayout';
import { State } from 'react-native-gesture-handler';

const MainScreen = () => {
  const H = Dimensions.get('window').height;
  const SNAP_Y = [H - 24, H - 160, 0];
  const y = useSharedValue(SNAP_Y[0]); // or default to SNAP_Y[1]
  const {setDate, setToday} = useHomeUIStore();


  useEffect(() => {
    const today = new Date();
  useHomeUIStore.getState().setDate(today);
  }, []);
  useEffect(() => {
    const today = new Date();
  useHomeUIStore.getState().setToday(today);
  }, []);

  const progress = useDerivedValue(() =>
    interpolate(
      y.value,
      [SNAP_Y[2], SNAP_Y[1], SNAP_Y[0]], // MONTH → WEEK → MIN
      [0,         0.5,       1],
      Extrapolate.CLAMP
    )
  );
  const { selectedDate } = useHomeUIStore();
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.25, 0.1], [0, 0.35], Extrapolate.CLAMP); 
    return {
      opacity,
    };
  });



  return (
    <View style={{ flex: 1 }}>
    
    
    {/* 컨텐츠 레이어 */}
    <SafeAreaView style={{ flex: 1, backgroundColor: '#bbb' }}>
      {/* 배경 레이어 */}
      <LinearGradient
        colors={['#ffffff', '#f7f7f7', '#f7f7f7', '#f7f7f7', '#f7f7f7']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <TopBar />
      <Text>{useHomeUIStore(state => state.selectedDate).toDateString()}</Text>
      <TwoColumnLayout progress={progress} />
      
      {/* <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} /> */}
      {/* Your components */}
      <HandleCalendarPanel y={y} progress={progress} style={styles.panel} />
    </SafeAreaView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex:10,
  },
  panel: {
    position: 'absolute',
    zIndex: 10,
  }
});

export default MainScreen;
