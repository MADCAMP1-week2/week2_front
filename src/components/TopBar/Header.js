// Header.js
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const Header = ({ onPressProfile, onPressSettings }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 }}>
      {/* 프로필 버튼 */}
      <TouchableOpacity
        onPress={onPressProfile}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#eee',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      </TouchableOpacity>

      {/* 설정 버튼 */}
      <TouchableOpacity onPress={onPressSettings}>
        <Text>{"설정"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
