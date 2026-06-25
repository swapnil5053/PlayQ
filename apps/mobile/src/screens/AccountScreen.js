import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Switch, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import Hoverable from '../components/ui/Hoverable';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { api } from '../services/api';

const AccountSkeleton = () => {
  return (
    <View style={styles.scrollContent}>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: COLORS.borderSubtle }]} />
        <View style={{ width: 150, height: 24, backgroundColor: COLORS.borderSubtle, borderRadius: 4, marginBottom: 8 }} />
        <View style={{ width: 100, height: 16, backgroundColor: COLORS.borderSubtle, borderRadius: 4 }} />
      </View>
      <View style={[styles.statsCard, { height: 120, backgroundColor: COLORS.borderSubtle }]} />
      <View style={[styles.walletCard, { height: 140, backgroundColor: COLORS.borderSubtle }]} />
    </View>
  );
};

export default function AccountScreen() {
  const navigation = useNavigation();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [familyMode, setFamilyMode] = useState(false);

  const fetchSummary = async () => {
    try {
      const data = await api.get('/session/summary');
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSummary();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <AccountSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Player Hub</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryPurple} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Hoverable scaleTo={1.05}>
            <View style={styles.avatar}>
              <Feather name="user" size={40} color={COLORS.whiteTextPrimary} />
            </View>
          </Hoverable>
          <Text style={styles.userName}>{auth.currentUser?.displayName || 'Player'}</Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        </View>

        {/* Wallet Section */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>My Wallet</Text>
            <MaterialCommunityIcons name="wallet-outline" size={24} color={COLORS.primaryPurple} />
          </View>
          <Text style={styles.walletBalance}>1,250 <Text style={styles.walletCurrency}>Coins</Text></Text>
          <PrimaryButton title="Recharge Wallet" style={{ marginTop: SPACING.md }} />
        </View>

        {/* Rewards Dashboard */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Rewards Progress</Text>
          <View style={styles.rewardProgressBg}>
            <View style={[styles.rewardProgressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.rewardText}>600 / 1000 XP to next level</Text>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.xxxl }}>
          <View style={styles.achievementBadge}>
            <MaterialCommunityIcons name="trophy-award" size={32} color="#F59E0B" />
            <Text style={styles.achievementText}>First Queue</Text>
          </View>
          <View style={styles.achievementBadge}>
            <MaterialCommunityIcons name="star-shooting" size={32} color={COLORS.primaryPurple} />
            <Text style={styles.achievementText}>Top Scorer</Text>
          </View>
          <View style={[styles.achievementBadge, { opacity: 0.5 }]}>
            <MaterialCommunityIcons name="lock" size={32} color={COLORS.greyTextTertiary} />
            <Text style={styles.achievementText}>Pac-Master</Text>
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.actionsSection}>
          <View style={styles.actionRow}>
            <View style={[styles.actionIconBg, { backgroundColor: COLORS.orangeBg }]}>
              <MaterialCommunityIcons name="human-male-child" size={20} color={COLORS.orangeMedWait} />
            </View>
            <Text style={styles.actionText}>Family Mode</Text>
            <Switch 
              value={familyMode} 
              onValueChange={setFamilyMode} 
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.primaryPurple }}
              thumbColor={COLORS.whiteTextPrimary}
            />
          </View>
          
          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionIconBg}>
              <Feather name="bell" size={20} color={COLORS.whiteTextPrimary} />
            </View>
            <Text style={styles.actionText}>Notifications</Text>
            <Feather name="chevron-right" size={20} color={COLORS.greyTextTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutSection}>
          <SecondaryButton title="Log Out" onPress={handleLogout} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundBase },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  headerTitle: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 28, color: COLORS.whiteTextPrimary },
  scrollContent: { padding: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginBottom: SPACING.xxxl },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.cardBackground, borderWidth: 2, borderColor: COLORS.primaryPurple, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  userName: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 24, color: COLORS.whiteTextPrimary, marginBottom: 4 },
  userEmail: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: COLORS.greyTextSecondary },
  walletCard: { backgroundColor: COLORS.cardBackground, borderRadius: BORDER_RADIUS.largeCards, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primaryPurple },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  walletTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.whiteTextPrimary },
  walletBalance: { fontFamily: 'ArchivoBlack_400Regular', fontSize: 36, color: COLORS.whiteTextPrimary },
  walletCurrency: { fontSize: 16, fontFamily: 'Montserrat_500Medium', color: COLORS.greyTextSecondary },
  statsCard: { backgroundColor: COLORS.cardBackground, borderRadius: BORDER_RADIUS.largeCards, padding: SPACING.xl, marginBottom: SPACING.xxxl, borderWidth: 1, borderColor: COLORS.borderSubtle },
  statsTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.whiteTextPrimary, marginBottom: SPACING.md },
  rewardProgressBg: { height: 8, backgroundColor: COLORS.borderSubtle, borderRadius: 4, marginBottom: SPACING.sm },
  rewardProgressFill: { height: '100%', backgroundColor: COLORS.primaryPurple, borderRadius: 4 },
  rewardText: { fontFamily: 'Montserrat_500Medium', fontSize: 12, color: COLORS.greyTextSecondary },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.whiteTextPrimary, marginBottom: SPACING.lg },
  achievementBadge: { width: 100, height: 100, backgroundColor: COLORS.cardBackground, borderRadius: BORDER_RADIUS.cards, borderWidth: 1, borderColor: COLORS.borderSubtle, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  achievementText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.whiteTextPrimary, marginTop: SPACING.sm },
  actionsSection: { marginBottom: SPACING.xxxl },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBackground, padding: SPACING.lg, borderRadius: BORDER_RADIUS.cards, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderSubtle },
  actionIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.purpleTint, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  actionText: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 15, color: COLORS.whiteTextPrimary },
  logoutSection: { marginTop: SPACING.lg }
});
