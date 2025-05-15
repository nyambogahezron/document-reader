import React, { useState } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

const AnimatedButton = ({
  children,
  onPress,
  style,
  containerStyle,
  activeOpacity = 0.7,
  disabled = false,
  scaleTo = 0.92,
  duration = 150,
  hitSlop,
  useTouchableWithoutFeedback = false,
  pressInSound = null,
  pressOutSound = null,
  feedbackEnabled = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation value for scale
  const scale = useAnimatedValue(1);
  
  // Handle touch events to create the press animation
  const handlePressIn = () => {
    setIsPressed(true);
    
    // Animate the scale down
    Animated.timing(scale, {
      toValue: scaleTo,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    
    // Animate the scale back to normal
    Animated.timing(scale, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };
  
  // Handle the actual press event
  const handlePress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, containerStyle]}
      onPress={handlePress}
      onPressIn={feedbackEnabled ? handlePressIn : undefined}
      onPressOut={feedbackEnabled ? handlePressOut : undefined}
      activeOpacity={activeOpacity}
      disabled={disabled}
      hitSlop={hitSlop || { top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.content,
          style,
          { transform: [{ scale }] },
          isPressed && styles.pressedContent,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedContent: {
    opacity: 0.9,
  },
});

export default AnimatedButton;