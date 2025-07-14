import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';

const CalendarSwiper = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState('MONTH');
  const [pages, setPages] = useState({
    prev: generateCalendarDates(selectedDate.subtract(1, viewMode === 'MONTH' ? 'month' : 'week'), viewMode),
    current: generateCalendarDates(selectedDate, viewMode),
    next: generateCalendarDates(selectedDate.add(1, viewMode === 'MONTH' ? 'month' : 'week'), viewMode),
  });

  const goToNext = () => {
    const newDate =
      viewMode === 'MONTH'
        ? selectedDate.add(1, 'month')
        : selectedDate.add(1, 'week').startOf('week');
    updateCalendar(newDate);
  };

  const goToPrev = () => {
    const newDate =
      viewMode === 'MONTH'
        ? selectedDate.subtract(1, 'month')
        : selectedDate.subtract(1, 'week').startOf('week');
    updateCalendar(newDate);
  };

  const swipeHandler = useAnimatedGestureHandler({
    onEnd: (e) => {
      if (e.translationX < -30) {
        runOnJS(goToNext)();
      } else if (e.translationX > 30) {
        runOnJS(goToPrev)();
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Prev" onPress={goToPrev} />
        <Text style={styles.month}>
          {viewMode === 'MONTH'
            ? selectedDate.format('MMMM YYYY')
            : selectedDate.format('W [week of] YYYY')}
        </Text>
        <Button title="Next" onPress={goToNext} />
      </View>

      <Button
        title={`Switch to ${viewMode === 'MONTH' ? 'WEEK' : 'MONTH'}`}
        onPress={() => {
          const newMode = viewMode === 'MONTH' ? 'WEEK' : 'MONTH';
          setViewMode(newMode);
          setCalendarMatrix(generateMatrix(selectedDate, newMode));
        }}
      />

      <PanGestureHandler onGestureEvent={swipeHandler}>
        <Animated.View style={styles.calendar}>
          {calendarMatrix.map((date, idx) => (
            <View key={idx} style={styles.cell}>
              <Text style={{ color: date.isSame(selectedDate, 'date') ? 'blue' : '#000' }}>
                {date.date()}
              </Text>
            </View>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

function generateMatrix(date, mode) {
  if (mode === 'MONTH') {
    const start = date.startOf('month').startOf('week');
    return Array.from({ length: 6 * 7 }, (_, i) => start.add(i, 'day'));
  } else {
    const start = date.startOf('week');
    return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
  }
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: { fontSize: 18, fontWeight: 'bold' },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  cell: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarSwiper;
