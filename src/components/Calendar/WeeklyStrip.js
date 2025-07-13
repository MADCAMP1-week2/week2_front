import React from 'react';
import { Dimensions, Pressable, Text, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import dayjs from 'dayjs';
import { useTodos } from '@hooks/useTodos';
import { useHomeUIStore } from '@store/homeUIStore';

const DAY_W = Dimensions.get('window').width / 7;

const DayTodos = ({ date }) => {
  const { data: todos = [] } = useTodos(date);
  return todos.slice(0, 3).map(t => (
    <View key={t.id} style={styles.todoChip}>
      <Text numberOfLines={1} style={styles.todoText}>
        {t.title}
      </Text>
    </View>
  ));
};

const WeekPage = ({ start }) => {
  const { selectedDate, setDate } = useHomeUIStore(
    s => ({ selectedDate: s.selectedDate, setDate: s.setDate }),
  );
  const days = [...Array(7).keys()].map(offset => start.add(offset, 'day'));

  return (
    <View style={{ flexDirection: 'row' }}>
      {days.map(d => {
        const active = dayjs(selectedDate).isSame(d, 'day');
        return (
          <Pressable
            key={d.format('YYYY-MM-DD')}
            style={[styles.dayBox, active && styles.dayActive]}
            onPress={() => setDate(d.toDate())}
          >
            <Text style={styles.dayText}>{d.date()}</Text>
            <DayTodos date={d.toDate()} />
          </Pressable>
        );
      })}
    </View>
  );
};

const WeeklyStrip = () => {
  // 오늘 기준 ±4주 버퍼
  const pages = [...Array(9).keys()].map(i =>
    dayjs().add(i - 4, 'week').startOf('week'),
  );

  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentOffset={{ x: DAY_W * 7 * 4, y: 0 }} // 첫 페이지 = 이번주
    >
      {pages.map(p => (
        <WeekPage key={p.toString()} start={p} />
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  dayBox: { width: DAY_W, alignItems: 'center', paddingVertical: 6 },
  dayActive: { borderRadius: 12, backgroundColor: '#ece7ff' },
  dayText: { fontSize: 13, color: '#444', marginBottom: 4 },
  todoChip: {
    minHeight: 16,
    paddingHorizontal: 4,
    backgroundColor: '#D8D8FF',
    borderRadius: 3,
    marginVertical: 1,
    justifyContent: 'center',
  },
  todoText: { fontSize: 9 },
});

export default WeeklyStrip;
