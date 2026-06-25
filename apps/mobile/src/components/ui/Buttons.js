import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../../theme';

export const PrimaryButton = ({ title, onPress, disabled, style, loading }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style, { width: '100%' }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.primaryButton, disabled && styles.disabled]}
      >
        <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const SecondaryButton = ({ title, onPress, disabled, style, danger }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style, { width: '100%' }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.secondaryButton, 
          danger && { borderColor: COLORS.redHighWait },
          disabled && styles.disabled
        ]}
      >
        <Text style={[styles.secondaryButtonText, danger && { color: COLORS.redHighWait }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: COLORS.primaryPurple,
    borderRadius: BORDER_RADIUS.buttons,
    paddingVertical: SPACING.lg,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.whiteTextPrimary,
    borderRadius: BORDER_RADIUS.buttons,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  },
  disabled: {
    opacity: 0.5,
  }
});
