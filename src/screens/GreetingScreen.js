import React, {useEffect, useState} from 'react';
import {View, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import greetingStyles from '../styles/greetingStyles';

const GreetingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={greetingStyles.container}>
      <Button
        title="로그인"
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
      <Button
        title="회원가입"
        onPress={() => {
          navigation.navigate('Signup');
        }}
      />
    </View>
  );
};

export default GreetingScreen;
