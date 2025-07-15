// Header.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 또는 Feather

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
        <Icon name="person" size={22} color="#555" />
      </TouchableOpacity>

      {/* 설정 버튼 */}
      <TouchableOpacity onPress={onPressSettings}>
        <Icon name="settings-outline" size={24} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
