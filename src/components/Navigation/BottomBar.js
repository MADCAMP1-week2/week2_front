import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useBottomBarStore } from '@store/bottomBarStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnimatedBottomBar({
  state,
  navigation,
}) {
  /** visible 값에 따라 바텀바를 위/아래로 슬라이드 */
  const visible = useBottomBarStore((s) => s.visible);
  const translateY = useSharedValue(visible ? 0 : 70);

  /* visible 변경 → 애니메이션 */
  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 70, { duration: 200 });
  }, [visible]);

  /* 실제 애니메이션 스타일 */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Shadow
        style={{ width: SCREEN_WIDTH }} // Shadow 는 픽셀 폭이 필요
        distance={20}
        offset={[0, -4]}
        startColor="rgba(0,0,0,0.02)"
        radius={25}
        corners={{ topStart: true, topEnd: true }}
      >
        <View style={[styles.container, { width: SCREEN_WIDTH }]}>
          {state.routes.map((route, idx) => {
            const isFocused = state.index === idx;
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.btn}
                onPress={() => navigation.navigate(route.name)}
              >
                <Text style={[styles.label, isFocused && styles.active]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Shadow>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#f4f4f4',
  },
  btn: { flex: 1, alignItems: 'center' },
  label: { color: '#888', fontSize: 14 },
  active: { color: '#000', fontWeight: 'bold' },
});
