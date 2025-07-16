import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [repeatType, setRepeatType] = useState('none');
  const [interval, setInterval] = useState(1);
  const [weekDays, setWeekDays] = useState([]);
  const [endDate, setEndDate] = useState(null);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [deadlinePickerOpen, setDeadlinePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const toggleWeekday = (day) => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      date,
      deadline,
      category,
      difficulty,
      repeat: {
        type: repeatType,
        interval,
        weekDays,
        endDate,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setDatePickerOpen(true)} style={styles.input}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={datePickerOpen}
        date={date}
        mode="date"
        onConfirm={(d) => {
          setDatePickerOpen(false);
          setDate(d);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity onPress={() => setDeadlinePickerOpen(true)} style={styles.input}>
        <Text>{deadline.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={deadlinePickerOpen}
        date={deadline}
        mode="date"
        onConfirm={(d) => {
          setDeadlinePickerOpen(false);
          setDeadline(d);
        }}
        onCancel={() => setDeadlinePickerOpen(false)}
      />

      <Text style={styles.label}>카테고리</Text>
      <TextInput value={category} onChangeText={setCategory} style={styles.input} />

      <Text style={styles.label}>난이도 (1~5)</Text>
      <TextInput
        value={String(difficulty)}
        onChangeText={(v) => setDifficulty(Number(v))}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Text style={styles.label}>반복</Text>
      <View style={styles.row}>
        {['none', 'daily', 'weekly', 'monthly'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setRepeatType(type)}
            style={[styles.repeatBtn, repeatType === type && styles.selected]}
          >
            <Text>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {repeatType === 'daily' && (
        <>
          <Text style={styles.label}>Interval (며칠마다):</Text>
          <TextInput
            value={String(interval)}
            onChangeText={(v) => setInterval(Number(v))}
            keyboardType="number-pad"
            style={styles.input}
          />
        </>
      )}

      {repeatType === 'weekly' && (
        <>
          <Text style={styles.label}>요일 선택 (0:일 ~ 6:토)</Text>
          <View style={styles.row}>
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => toggleWeekday(d)}
                style={[styles.dayBtn, weekDays.includes(d) && styles.selected]}
              >
                <Text>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Interval (몇 주마다)</Text>
          <TextInput
            value={String(interval)}
            onChangeText={(v) => setInterval(Number(v))}
            keyboardType="number-pad"
            style={styles.input}
          />
        </>
      )}

      <Text style={styles.label}>반복 종료일</Text>
      <TouchableOpacity onPress={() => setEndDatePickerOpen(true)} style={styles.input}>
        <Text>{endDate ? endDate.toLocaleDateString() : '무한 반복'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={endDatePickerOpen}
        date={endDate || new Date()}
        mode="date"
        onConfirm={(d) => {
          setEndDatePickerOpen(false);
          setEndDate(d);
        }}
        onCancel={() => setEndDatePickerOpen(false)}
      />

      <Button title="등록" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  repeatBtn: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 8,
  },
  selected: { backgroundColor: '#ddd' },
  dayBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
});
