import React, { useEffect } from 'react';
import { Pressable, Text, Dimensions } from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useModalStore } from '@store/modalStore';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function DateModal() {
  const { visible, modalDateKey, hideModal } = useModalStore();

  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', // 진한 색 써도 문제 없음
          justifyContent: 'flex-end',
        },
        overlayStyle,
      ]}
    >
      <Pressable style={{ flex: 1 }} onPress={hideModal} />
      <Animated.View
        entering={SlideInDown.duration(250)}
        exiting={SlideOutDown.duration(250)}
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          minHeight: 650,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{modalDateKey} 일정추가</Text>
      </Animated.View>
    </Animated.View>
  );
}
