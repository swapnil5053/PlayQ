import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ScreenSaver({ onWake }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulsing text animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, pulseAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <TouchableWithoutFeedback onPress={onWake}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F18', '#2A1A4A', '#0F0F18']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Animated Background Elements */}
        <Animated.View style={[styles.floatingIcon, { transform: [{ translateY }] }]}>
          <Feather name="aperture" size={120} color={COLORS.primaryPurple} style={styles.glow} />
        </Animated.View>

        <View style={styles.centerContent}>
          <Text style={styles.title}>JOYPAD</Text>
          <Text style={styles.subtitle}>ARCADE QUEUE</Text>
        </View>

        <Animated.View style={[styles.footer, { opacity: pulseAnim }]}>
          <Text style={styles.tapText}>TAP ANYWHERE TO START</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backgroundBase,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it covers everything
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.6,
  },
  glow: {
    textShadowColor: COLORS.primaryPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 64,
    color: COLORS.whiteTextPrimary,
    letterSpacing: 8,
    textShadowColor: COLORS.primaryPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.lightPurple,
    letterSpacing: 4,
    marginTop: SPACING.md,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.15,
  },
  tapText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
    letterSpacing: 2,
  }
});
