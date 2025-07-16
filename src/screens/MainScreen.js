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

import Header from '@components/TopBar/Header';
import Score from '@components/TopBar/Score';
import {DateModal} from '@components/Modals/DateModal';

const { height: H, width: W } = Dimensions.get('window');
const H_MIN = 24, H_WEEK = 180, H_NAVI = 65, H_FULL = H;
const CELL_H = 75, H_GAP = 4, V_GAP = 6, ROW_H = CELL_H + V_GAP * 2;
const HANDLE_H = 6, HANDLE_MV = 10; // handle height / marginVert
const TITLE_H = 46, HEADER_H = 20;
const HEADER_TOP_WEEK = HANDLE_H + HANDLE_MV * 2 + TITLE_H - 46;
const HEADER_DOWN_MONTH = 40, GRID_GAP = 2;
const SNAP_Y = [H - H_MIN - H_NAVI, H - H_WEEK - H_NAVI, 0];
const PROG = { MIN: 1, WEEK: 0.5, MONTH: 0 };

const MainScreen = () => {
  const H = Dimensions.get('window').height;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
      {/* 배경 레이어 */}
      <LinearGradient
        colors={['#ffffff', '#f7f7f7', '#f7f7f7', '#f7f7f7','#f7f7f7' ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Header
        onPressProfile={() => console.log('프로필 이동')}
        onPressSettings={() => console.log('설정 이동')}
      />
      <Score
        userName="윤아"
        score={589}
        stars={35}
        onRefresh={() => console.log('새로고침')}
      />
      <TwoColumnLayout progress={progress} />
      
      {/* <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} /> */}
      {/* Your components */}
      <HandleCalendarPanel y={y} progress={progress} style={styles.panel} />
      <DateModal />
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
