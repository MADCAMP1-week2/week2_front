// Score.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const Score = ({ userName = '윤아', score = 589, onRefresh }) => {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
      {/* 인사말 */}
      <Text style={{ fontSize: 20, fontFamily: "SCDream-Medium", color: "#262626" }}>
        {userName}님, 안녕하세요!
      </Text>

      {/* 점수 + 새로고침 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 48,  color: '#C90000', fontFamily: "SCDream-ExtraBold" }}>
          {score}
        </Text>
      </View>

      {/* 경고 텍스트 */}
      <Text style={{ color: 'red', color: '#C90000', fontFamily: "SCDream-Bold" }}>
        서두르세요! 할 일이 많습니다!
      </Text>

    </View>
  );
};

export default Score;
