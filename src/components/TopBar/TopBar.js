import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>윤아님, 안녕하세요!</Text>
      <Text style={styles.busyScore}>589</Text>
      <Text style={styles.subtitle}>서두르세요! 할 일이 많습니다!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'SCDream-Heavy',
    fontWeight: '600',
  },
  busyScore: {
    fontSize: 48,
    fontFamily: 'SCDream-ExtraBold',
    color: 'red',
  },
  subtitle: {
    color: 'red',
    marginTop: 4,
  },
});

export default TopBar;