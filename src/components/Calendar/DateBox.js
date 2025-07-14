import React from 'react';
import { Text, View } from 'react-native';
import dayjs from 'dayjs';

export default function DayBox({ date, inMonth, style }) {
  // date는 반드시 dayjs 인스턴스
  const num = date.date();      // 1~31 → 0 or 1

  return (
    <View style={[style]}>
      <Text style={{ color: inMonth ? '#000' : '#888' }}>{num}</Text>
    </View>
  );
}

