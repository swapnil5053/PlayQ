import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import { api } from '../services/api';
import { WaitTimeBadge } from '../components/ui/Cards';

export default function GameDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { gameId } = route.params;

  const [game, setGame] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      const [gameData, queueData] = await Promise.all([
        api.get(`/games/${gameId}`),
        api.get(`/queue/${gameId}`).catch(() => null) // Ignore error if not in queue
      ]);
      setGame(gameData);
      setQueueStatus(queueData);
    } catch (error) {
      console.error('Error fetching game details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    setActionLoading(true);
    try {
      await api.post('/queue/join', { gameId });
      await fetchGameDetails();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    setActionLoading(true);
    try {
      await api.post('/queue/leave', { gameId });
      setQueueStatus(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ideally this would save to a backend or AsyncStorage
  };

  if (loading || !game) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryPurple} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: game.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={COLORS.whiteTextPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <MaterialCommunityIcons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? COLORS.redHighWait : COLORS.whiteTextPrimary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{game.name}</Text>
            <WaitTimeBadge minutes={game.computedWaitMinutes} />
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{game.genre}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{game.difficulty}</Text>
            </View>
            <View style={styles.ratingTag}>
              <Feather name="star" size={14} color="#F59E0B" style={{ fill: '#F59E0B', marginRight: 4 }} />
              <Text style={styles.ratingText}>{game.rating}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{game.description}</Text>

          <View style={styles.queueCard}>
            <Text style={styles.queueTitle}>Queue Status</Text>
            
            {queueStatus ? (
              <View style={styles.inQueueContainer}>
                <View style={styles.positionBox}>
                  <Text style={styles.positionNumber}>{queueStatus.position}</Text>
                  <Text style={styles.positionLabel}>Position</Text>
                </View>
                <View style={styles.positionBox}>
                  <Text style={styles.positionNumber}>{queueStatus.estimatedWaitMinutes}m</Text>
                  <Text style={styles.positionLabel}>Wait Time</Text>
                </View>
              </View>
            ) : (
              <View style={styles.notInQueueContainer}>
                <Feather name="users" size={24} color={COLORS.greyTextTertiary} />
                <Text style={styles.queueLengthText}>{game.queueLength} people currently waiting</Text>
              </View>
            )}

            <View style={styles.actionContainer}>
              {queueStatus ? (
                <SecondaryButton 
                  title="Leave Queue" 
                  onPress={handleLeaveQueue} 
                  loading={actionLoading}
                  danger
                />
              ) : (
                <PrimaryButton 
                  title="Join Queue" 
                  onPress={handleJoinQueue} 
                  loading={actionLoading} 
                />
              )}
            </View>
          </View>

        </View>

          <View style={styles.leaderboardSection}>
            <TouchableOpacity 
              style={styles.leaderboardButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Scores', { gameId: game.id })}
            >
              <Feather name="award" size={24} color={COLORS.primaryPurple} />
              <View style={styles.leaderboardTextContainer}>
                <Text style={styles.leaderboardTitle}>Global Leaderboard</Text>
                <Text style={styles.leaderboardSubtitle}>See top scores and share yours!</Text>
              </View>
              <Feather name="chevron-right" size={24} color={COLORS.greyTextTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.leaderboardButton, { marginTop: SPACING.md }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Compare', { game })}
            >
              <MaterialCommunityIcons name="scale-balance" size={24} color="#F59E0B" />
              <View style={styles.leaderboardTextContainer}>
                <Text style={styles.leaderboardTitle}>Compare Stats</Text>
                <Text style={styles.leaderboardSubtitle}>See how you match up with the best</Text>
              </View>
              <Feather name="chevron-right" size={24} color={COLORS.greyTextTertiary} />
            </TouchableOpacity>
          </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 28,
    color: COLORS.whiteTextPrimary,
    flex: 1,
    marginRight: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.pills,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.greyTextSecondary,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: BORDER_RADIUS.pills,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#F59E0B',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
  },
  queueCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.largeCards,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryPurple,
    ...SHADOWS.card,
  },
  queueTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inQueueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  positionBox: {
    alignItems: 'center',
  },
  positionNumber: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 36,
    color: COLORS.primaryPurple,
  },
  positionLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.greyTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notInQueueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  queueLengthText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    marginTop: SPACING.sm,
  },
  actionContainer: {
    marginTop: SPACING.sm,
  },
  leaderboardSection: {
    marginTop: SPACING.lg,
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.cards,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  leaderboardTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  leaderboardTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  },
  leaderboardSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.greyTextSecondary,
    marginTop: 2,
  }
});
