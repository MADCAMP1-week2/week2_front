import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomBarStore } from '@store/bottomBarStore';
import { Shadow } from 'react-native-shadow-2';

export default function AnimatedBottomBar() {
  const visible = useBottomBarStore(state => state.visible);
  const translateY = useSharedValue(visible ? 0 : 100);
  console.log(visible);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 :100, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Shadow
      distance={8}
      startColor="rgba(0,0,0,0.08)"
      offset={[0, -4]}
      radius={16}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.label, route.name === 'Home' && styles.active]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text style={[styles.label, route.name === 'Settings' && styles.active]}>Settings</Text>
      </TouchableOpacity>
    </Animated.View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'white',

    // ⬆ 위쪽 테두리만
    borderTopWidth: 1,
    borderTopColor: '#eee',

    // ⬆ 위쪽 둥글게
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    // ⬇ 그림자 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,

    // ⬇ 그림자 (Android)
    elevation: 8,

    // ⬆ 내부 정렬
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 8,
  },
  label: {
    color: 'gray',
    fontSize: 14,
  },
  active: {
    color: '#000',
    fontWeight: 'bold',
  },
}); 
