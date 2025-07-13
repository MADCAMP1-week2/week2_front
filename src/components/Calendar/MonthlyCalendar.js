import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { useHomeUIStore } from '@store/homeUIStore';

const MonthlyCalendar = () => {
  const { selectedDate } = useHomeUIStore();
  const monthStart = dayjs(selectedDate).startOf('month');

  // ➡️ 실제 달력은 react-native-calendars 같은 라이브러리 붙여서 구현하세요
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>
        {monthStart.format('YYYY.MM')}
      </Text>
      <Text style={{ marginTop: 12, color: '#999' }}>
        (달력 그리드는 직접 / 라이브러리로 채워주세요)
      </Text>
    </View>
  );
};

export default MonthlyCalendar;
