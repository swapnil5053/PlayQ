import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from './Buttons';
import Hoverable from './Hoverable';

export const WaitTimeBadge = ({ minutes }) => {
  let bgColor = COLORS.greenBg;
  let textColor = COLORS.greenLowWait;

  if (minutes > 5 && minutes <= 15) {
    bgColor = COLORS.orangeBg;
    textColor = COLORS.orangeMedWait;
  } else if (minutes > 15) {
    bgColor = COLORS.redBg;
    textColor = COLORS.redHighWait;
  }

  return (
    <View style={[styles.waitBadge, { backgroundColor: bgColor }]}>
      <Text style={[styles.waitBadgeText, { color: textColor }]}>
        {minutes} min wait
      </Text>
    </View>
  );
};

export const GameCard = ({ game, onPress }) => {
  return (
    <Hoverable scaleTo={1.03}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.gameCard}>
        <Image source={{ uri: game.imageUrl }} style={styles.gameImage} />
        <LinearGradient
          colors={[COLORS.cardBackground, '#2A1A4A']}
          style={styles.gameContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tagsRow}>
            <View style={styles.difficultyTag}>
              <Text style={styles.difficultyText}>{game.difficulty}</Text>
            </View>
            <View style={styles.genreTag}>
              <Text style={styles.genreText}>{game.genre}</Text>
            </View>
          </View>
          
          <Text style={styles.gameTitle} numberOfLines={1}>{game.name}</Text>
          
          <View style={styles.gameFooter}>
            <WaitTimeBadge minutes={game.computedWaitMinutes} />
            <View style={styles.ratingRow}>
              <Feather name="star" size={14} color="#F59E0B" style={{ fill: '#F59E0B' }} />
              <Text style={styles.ratingText}>{game.rating?.toFixed(1)}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Hoverable>
  );
};

export const FeaturedCard = ({ featured, onPress }) => {
  if (!featured) return null;
  
  return (
    <Hoverable scaleTo={1.02}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.featuredCard}>
        <Image source={{ uri: featured.imageUrl }} style={styles.featuredImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.featuredOverlay}
        />
        
        <View style={styles.featuredContent}>
          <View>
            <Text style={styles.featuredLabel}>Record Score</Text>
            <Text style={styles.featuredScore}>{featured.score}</Text>
            <Text style={styles.featuredGameName}>{featured.gameName}</Text>
          </View>
          
          <PrimaryButton 
            title="Complete Now" 
            onPress={onPress}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </TouchableOpacity>
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  waitBadge: {
    borderRadius: BORDER_RADIUS.pills,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  waitBadgeText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
  },
  gameCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.cards,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  gameImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  gameContent: {
    padding: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  difficultyTag: {
    backgroundColor: COLORS.purpleTint,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.pills,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    color: COLORS.lightPurple,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.pills,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  genreText: {
    color: COLORS.greyTextSecondary,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
  },
  gameTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: COLORS.greyTextSecondary,
  },
  featuredCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: BORDER_RADIUS.largeCards,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    ...SHADOWS.strongCard,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    position: 'absolute',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredContent: {
    padding: SPACING.xl,
    paddingTop: 80, // push content to bottom
  },
  featuredLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.lightPurple,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredScore: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 48,
    color: COLORS.whiteTextPrimary,
    marginTop: -5,
  },
  featuredGameName: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    marginBottom: SPACING.sm,
  }
});

export const GameCardSkeleton = () => {
  const pulseAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View style={[styles.gameCard, { opacity: pulseAnim }]}>
      <View style={[styles.gameImage, { backgroundColor: COLORS.borderSubtle }]} />
      <View style={styles.gameContent}>
        <View style={styles.tagsRow}>
          <View style={{ width: 60, height: 22, backgroundColor: COLORS.borderSubtle, borderRadius: BORDER_RADIUS.pills }} />
          <View style={{ width: 50, height: 22, backgroundColor: COLORS.borderSubtle, borderRadius: BORDER_RADIUS.pills }} />
        </View>
        
        <View style={{ width: '80%', height: 20, backgroundColor: COLORS.borderSubtle, borderRadius: 4, marginBottom: SPACING.sm }} />
        
        <View style={styles.gameFooter}>
          <View style={{ width: 70, height: 20, backgroundColor: COLORS.borderSubtle, borderRadius: BORDER_RADIUS.pills }} />
          <View style={{ width: 40, height: 16, backgroundColor: COLORS.borderSubtle, borderRadius: 4 }} />
        </View>
      </View>
    </Animated.View>
  );
};
