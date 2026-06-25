import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui/Buttons';

export default function MapScreen() {
  const [showHeatMap, setShowHeatMap] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Arcade Map</Text>
            <Text style={styles.headerSubtitle}>Find your favorite games</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleButton, showHeatMap && styles.toggleButtonActive]}
            onPress={() => setShowHeatMap(!showHeatMap)}
          >
            <MaterialCommunityIcons 
              name="fire" 
              size={20} 
              color={showHeatMap ? COLORS.whiteTextPrimary : COLORS.orangeMedWait} 
            />
            <Text style={[styles.toggleButtonText, showHeatMap && { color: COLORS.whiteTextPrimary }]}>
              Heat Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.mapContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom={true}
        >
          <View style={styles.imageWrapper}>
            <Image 
              source={require('../../assets/arcade_map_neon.png')} 
              style={styles.mapImage} 
              resizeMode="contain"
            />
            {showHeatMap && (
              <View style={styles.heatMapOverlay}>
                {/* Mock Heat Zones */}
                <View style={[styles.heatZone, { top: '30%', left: '40%', backgroundColor: 'rgba(239, 68, 68, 0.4)', width: 150, height: 150 }]} />
                <View style={[styles.heatZone, { top: '60%', left: '20%', backgroundColor: 'rgba(245, 158, 11, 0.4)', width: 200, height: 200 }]} />
                <View style={[styles.heatZone, { top: '20%', left: '70%', backgroundColor: 'rgba(16, 185, 129, 0.3)', width: 100, height: 100 }]} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <PrimaryButton 
          title="Start AR Navigation" 
          onPress={() => navigation.navigate('ARNavigation')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 28,
    color: COLORS.whiteTextPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.pills,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.orangeMedWait,
    borderColor: COLORS.orangeMedWait,
  },
  toggleButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  mapContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 1000,
    height: 1000,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  heatMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heatZone: {
    position: 'absolute',
    borderRadius: 999,
    filter: 'blur(30px)', // Web only mostly, but good for react-native-web
  },
  bottomBar: {
    padding: SPACING.xl,
    backgroundColor: COLORS.backgroundBase,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  }
});
