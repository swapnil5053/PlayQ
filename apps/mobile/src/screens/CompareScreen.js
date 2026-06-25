import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { PrimaryButton } from '../components/ui/Buttons';

export default function CompareScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { game } = route.params || {};

  const myStats = { score: 14500, time: '2h 15m', rank: 42 };
  const topStats = { score: 32000, time: '18h 40m', rank: 1 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.whiteTextPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Stats</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.gameTitle}>{game?.name || 'Arcade Game'}</Text>
        
        <View style={styles.compareGrid}>
          {/* Header Row */}
          <View style={styles.row}>
            <View style={styles.cell} />
            <View style={styles.cell}>
              <View style={styles.avatarMe}>
                <Feather name="user" size={24} color={COLORS.whiteTextPrimary} />
              </View>
              <Text style={styles.playerLabel}>You</Text>
            </View>
            <View style={styles.cell}>
              <View style={styles.avatarTop}>
                <MaterialCommunityIcons name="crown" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.playerLabel}>Top Player</Text>
            </View>
          </View>

          {/* High Score */}
          <View style={styles.row}>
            <View style={styles.cellTitle}><Text style={styles.statLabel}>High Score</Text></View>
            <View style={styles.cell}><Text style={styles.statValueMe}>{myStats.score}</Text></View>
            <View style={styles.cell}><Text style={styles.statValueTop}>{topStats.score}</Text></View>
          </View>

          {/* Time Played */}
          <View style={styles.row}>
            <View style={styles.cellTitle}><Text style={styles.statLabel}>Time Played</Text></View>
            <View style={styles.cell}><Text style={styles.statValueMe}>{myStats.time}</Text></View>
            <View style={styles.cell}><Text style={styles.statValueTop}>{topStats.time}</Text></View>
          </View>

          {/* Rank */}
          <View style={styles.row}>
            <View style={styles.cellTitle}><Text style={styles.statLabel}>Global Rank</Text></View>
            <View style={styles.cell}><Text style={styles.statValueMe}>#{myStats.rank}</Text></View>
            <View style={styles.cell}><Text style={styles.statValueTop}>#{topStats.rank}</Text></View>
          </View>
        </View>

        <PrimaryButton 
          title="Play Now to Improve" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: SPACING.xxxl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundBase },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.cardBackground, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderSubtle },
  headerTitle: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 20, color: COLORS.whiteTextPrimary },
  scrollContent: { padding: SPACING.xl },
  gameTitle: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 28, color: COLORS.primaryPurple, textAlign: 'center', marginBottom: SPACING.xxxl },
  compareGrid: { backgroundColor: COLORS.cardBackground, borderRadius: BORDER_RADIUS.largeCards, borderWidth: 1, borderColor: COLORS.borderSubtle, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  cellTitle: { flex: 1, padding: SPACING.lg, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  cell: { flex: 1, padding: SPACING.lg, alignItems: 'center', justifyContent: 'center' },
  avatarMe: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryPurple, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  avatarTop: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1, borderColor: '#F59E0B', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  playerLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.whiteTextPrimary },
  statLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.greyTextSecondary },
  statValueMe: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 18, color: COLORS.whiteTextPrimary },
  statValueTop: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 18, color: '#F59E0B' },
});
