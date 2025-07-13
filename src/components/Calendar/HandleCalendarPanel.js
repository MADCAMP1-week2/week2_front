import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useHomeUIStore } from '@store/homeUIStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN = 0;
const MID = SCREEN_HEIGHT * 0.4; // weekly height
const MAX = SCREEN_HEIGHT; // monthly

const HandleCalendarPanel = () => {
  const { panelPosition, setPanelPosition } = useHomeUIStore();
  const translateY = useSharedValue(MID);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropOpacity = useDerivedValue(() =>
    interpolate(translateY.value, [MID, MIN], [0, 0.5], Extrapolate.CLAMP)
  );

  const onGesture = ({ nativeEvent }) => {
    translateY.value = nativeEvent.translationY;
  };

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === 5 /* END */) {
      // Decide target snap point
      let target = MID;
      if (translateY.value < MID / 2) target = MIN; // monthly
      else if (translateY.value > MID * 1.5) target = MAX; // minimized
      translateY.value = withTiming(target, { duration: 300 });
    }
  };

  return (
    <>
      {/* backdrop */}
      <Animated.View
        pointerEvents="none"
        style={[styles.backdrop, { opacity: backdropOpacity.value }]}
      />

      <PanGestureHandler
        onGestureEvent={onGesture}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.panel, animatedStyle]}>
          <View style={styles.handle} />
          {/* TODO: Render WeeklyCalendar or MonthlyCalendar based on snap */}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});

export default HandleCalendarPanel;