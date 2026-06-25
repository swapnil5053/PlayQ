import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

export default function ARNavigationScreen() {
  const navigation = useNavigation();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Mock Camera Background */}
      <View style={styles.cameraBackground}>
        <View style={styles.gridOverlay} />
        
        {/* AR Elements */}
        <Animated.View style={[styles.arArrowContainer, { transform: [{ translateY: bounceAnim }] }]}>
          <Feather name="arrow-up" size={80} color={COLORS.primaryPurple} />
          <Text style={styles.distanceText}>15 ft</Text>
        </Animated.View>

        <View style={styles.targetPin}>
          <MaterialCommunityIcons name="map-marker-radius" size={40} color={COLORS.orangeMedWait} />
          <Text style={styles.targetText}>Pac-Man Battle Royale</Text>
        </View>
      </View>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.whiteTextPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AR Navigation</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.instructionText}>Point your camera forward and follow the arrows to your destination.</Text>
        <TouchableOpacity style={styles.endButton} onPress={() => navigation.goBack()}>
          <Text style={styles.endButtonText}>End Navigation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    // Mocking a grid with borders
    borderWidth: 1,
    borderColor: COLORS.primaryPurple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 20,
    color: COLORS.whiteTextPrimary,
  },
  arArrowContainer: {
    alignItems: 'center',
    marginTop: -100,
  },
  distanceText: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 32,
    color: COLORS.whiteTextPrimary,
    marginTop: SPACING.sm,
    textShadowColor: COLORS.primaryPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  targetPin: {
    position: 'absolute',
    bottom: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.cards,
    borderWidth: 1,
    borderColor: COLORS.orangeMedWait,
  },
  targetText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
    marginTop: SPACING.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: BORDER_RADIUS.modalTop,
    borderTopRightRadius: BORDER_RADIUS.modalTop,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderBottomWidth: 0,
  },
  instructionText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  endButton: {
    backgroundColor: COLORS.redHighWait,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.buttons,
    alignItems: 'center',
  },
  endButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  }
});
