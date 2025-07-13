import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';
import { useSchedules } from '@hooks/useSchedules';
import ScheduleBlock from './ScheduleBlock';

const hours = Array.from({ length: 24 }, (_, i) => i);

const ScheduleView = ({ date }) => {
  const scrollRef = useRef(null);
  const { data: schedules = [] } = useSchedules(date);

  useEffect(() => {
    // Scroll to current hour on mount
    const hour = dayjs().hour();
    const offset = hour * 60; // simplistic, 60px per hour row height assumption
    scrollRef.current?.scrollTo({ y: offset, animated: false });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef}>
        {hours.map(h => (
          <View key={h} style={styles.hourRow}>
            <Text style={styles.hourText}>{h}</Text>
            <View style={styles.hourContent}>
              {schedules
                .filter(s => Number(s.startTime.split(':')[0]) === h)
                .map(s => (
                  <ScheduleBlock key={s.id} item={s} />
                ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Current time red line */}
      <CurrentTimeLine />
      {/* Gradient top & bottom fade */}
      <LinearGradient
        colors={['#ffffff', 'transparent']}
        pointerEvents="none"
        style={[styles.gradient, { top: 0 }]} />
      <LinearGradient
        colors={['transparent', '#ffffff']}
        pointerEvents="none"
        style={[styles.gradient, { bottom: 0 }]} />
    </View>
  );
};

const CurrentTimeLine = () => {
  const now = dayjs();
  const top = now.hour() * 60 + now.minute();
  return <View style={[styles.line, { top }]} />;
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 60, // each hour row 60px
    paddingHorizontal: 10,
  },
  hourText: {
    width: 30,
    fontSize: 12,
    color: '#888',
  },
  hourContent: {
    flex: 1,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'red',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 30,
  },
});

export default ScheduleView;
