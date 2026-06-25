import React, { useRef } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

export default function Hoverable({ children, style, scaleTo = 1.03, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scale, {
        toValue: scaleTo,
        useNativeDriver: false,
        friction: 6,
        tension: 40,
      }).start();
    }
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
        friction: 6,
        tension: 40,
      }).start();
    }
  };

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      {...props}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
