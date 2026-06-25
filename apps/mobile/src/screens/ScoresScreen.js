import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Share, Platform, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { api } from '../services/api';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function ScoresScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const gameId = route.params?.gameId || 'neon-racer'; 
  
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameDetails, setGameDetails] = useState(null);
  
  // QR Modal State
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);

  useEffect(() => {
    // Fetch static game details first
    fetchGameDetails();

    // Set up real-time Firebase listener for scores
    const q = query(
      collection(db, 'scores'),
      where('gameId', '==', gameId),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const realTimeScores = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        computedRank: index + 1,
        ...doc.data()
      }));
      setScores(realTimeScores);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching real-time scores:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      const gameRes = await api.get(`/games/${gameId}`);
      setGameDetails(gameRes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNativeShare = async () => {
    if (!selectedScore) return;
    try {
      const message = `Check out this high score! ${selectedScore.playerName} scored ${selectedScore.score} on ${gameDetails?.name || 'The Arcade'}! Can you beat it? 🎮🏆`;
      await Share.share({
        message,
        title: 'Arcade High Score'
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const openShareModal = (scoreEntry) => {
    setSelectedScore(scoreEntry);
    setQrModalVisible(true);
  };

  const renderItem = ({ item, index }) => {
    const isTop3 = index < 3;
    return (
      <View style={[styles.scoreCard, isTop3 && styles.topScoreCard]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rankText, isTop3 && styles.topRankText]}>#{index + 1}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.playerName}>{item.playerName}</Text>
          <Text style={styles.scoreValue}>{item.score.toLocaleString()} PTS</Text>
        </View>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={() => openShareModal(item)}
          activeOpacity={0.7}
        >
          <Feather name="share-2" size={20} color={isTop3 ? COLORS.lightPurple : COLORS.greyTextSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.whiteTextPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSubtitle}>{gameDetails?.name || 'Loading...'}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryPurple} />
        </View>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="award" size={48} color={COLORS.borderSubtle} />
              <Text style={styles.emptyText}>No scores yet! Be the first to play.</Text>
            </View>
          }
        />
      )}

      {/* QR Code Share Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeModalButton} 
              onPress={() => setQrModalVisible(false)}
            >
              <Feather name="x" size={24} color={COLORS.greyTextSecondary} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Share High Score</Text>
            <Text style={styles.modalSubtitle}>Scan this QR code to view the leaderboard for {gameDetails?.name}</Text>
            
            <View style={styles.qrContainer}>
              {Platform.OS === 'web' ? (
                <Text style={{color: COLORS.primaryPurple, padding: 20, textAlign: 'center'}}>QR Code disabled on Web to prevent SVG native crash. Use native app to scan.</Text>
              ) : (
                <QRCode
                  value={`https://thearcade.app/scores/${gameId}?player=${selectedScore?.playerName}`}
                  size={200}
                  color={COLORS.primaryPurple}
                  backgroundColor={COLORS.cardBackground}
                />
              )}
            </View>

            <TouchableOpacity 
              style={styles.nativeShareButton} 
              onPress={handleNativeShare}
              activeOpacity={0.8}
            >
              <Feather name="share" size={20} color={COLORS.whiteTextPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.nativeShareText}>Share via Text / Social</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 20,
    color: COLORS.whiteTextPrimary,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.primaryPurple,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.cards,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  topScoreCard: {
    backgroundColor: COLORS.purpleTint,
    borderColor: COLORS.primaryPurple,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 18,
    color: COLORS.greyTextSecondary,
  },
  topRankText: {
    color: COLORS.whiteTextPrimary,
    fontSize: 22,
  },
  scoreInfo: {
    flex: 1,
    paddingLeft: SPACING.md,
  },
  playerName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  },
  scoreValue: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.lightPurple,
    marginTop: 2,
  },
  shareButton: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    marginTop: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    padding: SPACING.sm,
  },
  modalTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 22,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
  },
  modalSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  qrContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.whiteTextPrimary,
    borderRadius: BORDER_RADIUS.cards,
    marginBottom: SPACING.xl,
  },
  nativeShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryPurple,
    width: '100%',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.buttons,
    marginBottom: SPACING.xl,
  },
  nativeShareText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  }
});
