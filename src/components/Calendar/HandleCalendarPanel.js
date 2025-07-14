// HandleCalendarPanel.js — Header ↕ Animation & Consistent Gap (FINAL)
// 1. DayHeader up (Week) / down +12 (Month) via headerTranslate
// 2. Grid follows headerTranslate
// 3. Mask marginTop animated with headerTranslate → gap 2px 유지

import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useDerivedValue, useAnimatedGestureHandler, useAnimatedStyle,
  withSpring, withDelay, withTiming, interpolate, Extrapolate, runOnJS, Easing
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { useHomeUIStore } from '@store/homeUIStore';
import { useBottomBarStore } from '@store/bottomBarStore';
import { getCalendarMatrix } from '@services/getCalendarMatrix';
import dayjs from 'dayjs';
import DayBox from './DateBox';

/* ───────── Layout ───────── */
const { height: H, width: W } = Dimensions.get('window');
const H_MIN = 32, H_WEEK = 150, H_NAVI = 65, H_FULL = H;
const CELL_H = 75, H_GAP = 2, V_GAP = 7, ROW_H = CELL_H + V_GAP * 2;
const HANDLE_AREA = 6 + 10 * 2; // handle height + marginVert
const TITLE_AREA = 46;          // rough title block height
const HEADER_H = 25;

const HEADER_TOP_WEEK = HANDLE_AREA + TITLE_AREA - 46; // 44
const HEADER_DOWN_MONTH = 40;  // MonthView extra drop
const GRID_GAP = 2;            // Header ↔ Grid gap

const SNAP_Y = [H - H_MIN - H_NAVI, H - H_WEEK - H_NAVI, 0]; // MIN, WEEK, MONTH
const PROG   = { MIN:1, WEEK:0.5, MONTH:0 };
const focusedRow = 2;
const monthTitle = '7';

/* ───────── Main Component ───────── */
export default function HandleCalendarPanel({ y }) {
  const { panelSnap, setSnap } = useHomeUIStore(s => ({ panelSnap: s.panelSnap, setSnap: s.setSnap }));
  const setVisible = useBottomBarStore(s => s.setVisible);

  const calendarMatrix = useMemo(() => {
    return getCalendarMatrix(viewedDate.getFullYear(), viewedDate.getMonth());
  }, [viewedDate]);

  useEffect(()=>{ y.value = withTiming(SNAP_Y[2 - panelSnap * 2], { duration: 300, easing: Easing.out(Easing.cubic) }); setVisible(panelSnap!==0); },[panelSnap]);

  /* progress 0→0.5→1 */
  const progress = useDerivedValue(()=>
    interpolate(y.value, [SNAP_Y[2], SNAP_Y[1], SNAP_Y[0]],[0,0.5,1], Extrapolate.CLAMP));

  /* gesture */
  const pan = useAnimatedGestureHandler({
    onStart:(_,ctx)=>{ if(panelSnap===0)return; ctx.start=y.value; },
    onActive:(e,ctx)=>{ if(panelSnap===0)return; y.value=Math.max(Math.min(ctx.start+e.translationY,SNAP_Y[0]),SNAP_Y[2]); },
    onEnd:()=>{ const dest=snapPoint(y.value,0,SNAP_Y); y.value=withSpring(dest,{damping:500,stiffness:300},()=>runOnJS(setSnap)(PROG[dest===SNAP_Y[0]?'MIN':dest===SNAP_Y[1]?'WEEK':'MONTH'])); }
  });

  /* header & grid offset */
  const headerTranslate = useDerivedValue(()=>
    interpolate(progress.value,[0.5,0],[0,HEADER_DOWN_MONTH],Extrapolate.CLAMP));

  const gridShift = useDerivedValue(()=>
    interpolate(progress.value,[0.5,0],[-focusedRow*ROW_H,0],Extrapolate.CLAMP));

  const maskH = useDerivedValue(()=> -gridShift.value + ROW_H*(calendarMatrix.length /7));

  const handleScale = useDerivedValue(()=>
    interpolate(progress.value,[0.25,0],[1,0.5],Extrapolate.CLAMP));

  /* styles */
  const sheetSt = useAnimatedStyle(()=>({ transform:[{translateY:y.value}], borderTopLeftRadius:interpolate(progress.value,[0.25,0],[20,0],Extrapolate.CLAMP), borderTopRightRadius:interpolate(progress.value,[0.25,0],[20,0],Extrapolate.CLAMP) }));
  const handleBarSt = useAnimatedStyle(()=>({ opacity:interpolate(progress.value,[0,0.25],[0,1],Extrapolate.CLAMP), transform:[{scaleX:handleScale.value}]}) );
  const titleSt = useAnimatedStyle(()=>({ opacity:interpolate(progress.value,[0.2,0.1],[0,1],Extrapolate.CLAMP) }));
  const headerSt = useAnimatedStyle(()=>({ transform:[{translateY:headerTranslate.value}] }));
  const gridSt   = useAnimatedStyle(()=>({ transform:[{translateY:gridShift.value}] }));
  const maskSt   = useAnimatedStyle(()=>({ marginTop:HEADER_H+GRID_GAP+headerTranslate.value, height:maskH.value, overflow:'hidden' }));

  const rowStyles = Array.from({length:(calendarMatrix.length /7)},(_,row)=>{
    if(row===focusedRow) return useAnimatedStyle(()=>({opacity:1}));
    const off=Math.abs(row-focusedRow); const st=0.5-off*0.1;
    return useAnimatedStyle(()=>({ opacity:interpolate(progress.value,[st,0],[0,1],Extrapolate.CLAMP), transform:[{translateY:interpolate(progress.value,[st,0],[0,0],Extrapolate.CLAMP)}] }));
  });

  const handleExit=()=>{ if(panelSnap===0) setSnap(1); };

  return (
    <PanGestureHandler onGestureEvent={pan} activeOffsetY={[-25,25]}>
      <Animated.View style={[styles.sheet,sheetSt]}>
        <Animated.View style={[styles.handleBar,handleBarSt]} />
        <Animated.View style={styles.closeBtnWrap}><TouchableOpacity onPress={handleExit}><Text style={styles.closeText}>✕</Text></TouchableOpacity></Animated.View>
        <Animated.View style={[styles.header,titleSt]}><Text style={styles.title}>{monthTitle}</Text></Animated.View>

        <Animated.View style={[styles.dayHeader,headerSt]}>
          {['일','월','화','수','목','금','토'].map((d,i)=>(<Text key={i} style={[styles.dayLabel,i===0&&styles.sun,i===6&&styles.sat]}>{d}</Text>))}
        </Animated.View>

        <Animated.View style={[styles.mask,maskSt]}>
          <Animated.View style={[styles.monthGrid,gridSt]}>
            {Array.from({ length: calendarMatrix.length / 7 }, (_, row) => (
              <Animated.View key={row} style={[styles.row, rowStyles[row]]}>
                {calendarMatrix.slice(row * 7, row * 7 + 7).map((day, col) => (
                  <DayBox key={col} date={day.date} inMonth={day.inMonth} />
                ))}
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

/* ───────── Styles ───────── */
const styles=StyleSheet.create({
  sheet:{position:'absolute',top:0,left:0,right:0,height:H_FULL,backgroundColor:'#fff'},
  handleBar:{alignSelf:'center',width:44,height:6,borderRadius:4,backgroundColor:'#bbb',marginVertical:10},
  closeBtnWrap:{position:'absolute',alignSelf:'center',bottom:30,padding:4,zIndex:1},
  closeText:{fontSize:18,color:'#666'},
  header:{position:'absolute',top:10,left:0,paddingHorizontal:20,paddingBottom:8},
  title:{fontSize:36,fontWeight:'600',color:'#222'},
  dayHeader:{position:'absolute',top:HEADER_TOP_WEEK,left:0,width:W,height:HEADER_H,flexDirection:'row',justifyContent:'space-around',alignItems:'center'},
  dayLabel:{width:W/7,textAlign:'center',fontSize:12,fontWeight:'500',color:'#444'},
  sun:{color:'#D33'},
  sat:{color:'#36C'},
  dayBox:{width:W/7-H_GAP*2,height:CELL_H,marginHorizontal:H_GAP,marginVertical:V_GAP,justifyContent:'center',alignItems:'center',borderWidth:StyleSheet.hairlineWidth,borderColor:'#ddd',borderRadius:6},
  dayText:{fontSize:11,color:'#555'},
  mask:{width:W},
  monthGrid:{flexDirection:'column'},
  row:{flexDirection:'row',height:ROW_H},
});
