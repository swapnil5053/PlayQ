import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { GameCard, FeaturedCard, GameCardSkeleton } from '../components/ui/Cards';
import { api } from '../services/api';
import { auth } from '../services/firebase';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const userName = auth.currentUser?.displayName || 'Player';

  const fetchData = async () => {
    try {
      const [gamesData, featuredData] = await Promise.all([
        api.get('/games'),
        api.get('/today-high-score')
      ]);
      setGames(gamesData);
      setFeatured(featuredData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleGamePress = (game) => {
    // Navigate to game detail or discovery for now
    navigation.navigate('Discovery', { screen: 'GameDetail', params: { gameId: game.id } });
  };

  return (
    <LinearGradient
      colors={['#1a0b2e', COLORS.backgroundBase]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.4 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Account')}>
            <Feather name="user" size={20} color={COLORS.whiteTextPrimary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Queues</Text>
            </View>
            <View style={styles.gamesList}>
              <GameCardSkeleton />
              <GameCardSkeleton />
              <GameCardSkeleton />
            </View>
          </ScrollView>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryPurple} />}
          >
            {featured && (
              <View style={styles.section}>
                <FeaturedCard 
                  featured={featured} 
                  onPress={() => handleGamePress({ id: featured.gameId })} 
                />
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Queues</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Discovery')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gamesList}>
              {games.slice(0, 5).map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPress={() => handleGamePress(game)} 
                />
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  userName: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 24,
    color: COLORS.whiteTextPrimary,
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
  },
  seeAllText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.lightPurple,
  },
  gamesList: {
    gap: SPACING.md,
  }
});
