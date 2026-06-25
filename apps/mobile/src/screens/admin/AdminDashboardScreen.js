import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const adminModules = [
    { name: 'Game Management', icon: 'grid', route: 'GameManagement', color: '#8B5CF6' },
    { name: 'Queue Status', icon: 'users', route: 'QueueManagement', color: '#3B82F6' },
    { name: 'Score Entry', icon: 'award', route: 'ScoreEntry', color: '#F59E0B' },
    { name: 'Featured Game', icon: 'star', route: 'FeaturedGame', color: '#10B981' },
    { name: 'User Database', icon: 'database', route: 'UserList', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Venue Operations</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={COLORS.redHighWait} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {adminModules.map((module, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.moduleCard}
              onPress={() => navigation.navigate(module.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: `${module.color}20` }]}>
                <Feather name={module.icon} size={28} color={module.color} />
              </View>
              <Text style={styles.moduleName}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 24,
    color: COLORS.whiteTextPrimary,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.greyTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  logoutBtn: {
    padding: 10,
  },
  content: {
    padding: SPACING.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.cards,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  moduleName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.whiteTextPrimary,
    textAlign: 'center',
  }
});
