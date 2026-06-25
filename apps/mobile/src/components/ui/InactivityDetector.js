import React, { useState, useEffect, useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import ScreenSaver from '../../screens/ScreenSaver';

export default function InactivityDetector({ children, timeoutMs = 60000 }) {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (isInactive) {
      setIsInactive(false);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsInactive(true);
    }, timeoutMs);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetTimer();
        return false;
      },
      onMoveShouldSetPanResponder: () => {
        resetTimer();
        return false;
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
      {isInactive && <ScreenSaver onWake={resetTimer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
