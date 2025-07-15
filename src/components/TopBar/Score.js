// Score.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Score = ({ userName = '윤아', score = 589, stars = 35, onRefresh }) => {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
      {/* 인사말 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {userName}님, 안녕하세요!
      </Text>

      {/* 점수 + 새로고침 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'red' }}>
          {score}
        </Text>
        <TouchableOpacity onPress={onRefresh} style={{ marginLeft: 4 }}>
          <Icon name="refresh" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* 경고 텍스트 */}
      <Text style={{ color: 'red', fontWeight: 'bold' }}>
        서두르세요! 할 일이 많습니다!
      </Text>

      {/* 별점 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Icon name="star" size={18} color="orange" />
        <Text style={{ marginLeft: 4, fontWeight: 'bold', color: '#555' }}>{stars}</Text>
      </View>
    </View>
  );
};

export default Score;
