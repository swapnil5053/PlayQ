import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons';
import Hoverable from '../components/ui/Hoverable';

export default function SupportScreen() {
  const navigation = useNavigation();
  const faqs = [
    { q: 'How do queues work?', a: 'Join a queue for a game and we will notify you when it is your turn. You can only be in one queue at a time.' },
    { q: 'How is wait time calculated?', a: 'Wait times are estimated based on average play sessions and current queue length. Live adjustments may occur.' },
    { q: 'Can I cancel my queue?', a: 'Yes, you can leave the queue at any time from the queue screen.' },
  ];

  const handleReportIssue = () => {
    alert("Report Issue modal opened (mock)");
  };

  const handleTutorial = () => {
    alert("Tutorial started (mock)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Hub</Text>
        <Text style={styles.headerSubtitle}>How can we help you?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.grid}>
          {/* Chat Support */}
          <Hoverable scaleTo={1.03}>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconBg, { backgroundColor: COLORS.purpleTint }]}>
                <Feather name="message-circle" size={24} color={COLORS.primaryPurple} />
              </View>
              <Text style={styles.actionTitle}>Live Chat</Text>
              <Text style={styles.actionSubtitle}>Typically replies in minutes</Text>
              <PrimaryButton 
                title="Chat Now" 
                style={{ width: 120, marginTop: SPACING.md }} 
                onPress={() => navigation.navigate('Concierge')}
              />
            </View>
          </Hoverable>

          {/* Report Issue */}
          <Hoverable scaleTo={1.03}>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Feather name="alert-triangle" size={24} color={COLORS.redHighWait} />
              </View>
              <Text style={styles.actionTitle}>Report Issue</Text>
              <Text style={styles.actionSubtitle}>Broken machine? Let us know</Text>
              <SecondaryButton 
                title="Report" 
                style={{ width: 120, marginTop: SPACING.md }} 
                onPress={handleReportIssue}
              />
            </View>
          </Hoverable>
        </View>

        {/* Tutorial Banner */}
        <Hoverable scaleTo={1.02}>
          <TouchableOpacity style={styles.tutorialBanner} onPress={handleTutorial}>
            <View style={styles.tutorialContent}>
              <Text style={styles.tutorialTitle}>App Tutorial</Text>
              <Text style={styles.tutorialSubtitle}>Learn how to use Joypad Queue</Text>
            </View>
            <Feather name="play-circle" size={32} color={COLORS.whiteTextPrimary} />
          </TouchableOpacity>
        </Hoverable>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqA}>{faq.a}</Text>
            </View>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
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
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'column',
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  actionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.largeCards,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  actionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    textAlign: 'center',
  },
  tutorialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryPurple,
    borderRadius: BORDER_RADIUS.largeCards,
    padding: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 20,
    color: COLORS.whiteTextPrimary,
    marginBottom: 4,
  },
  tutorialSubtitle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.lg,
  },
  faqList: {
    gap: SPACING.md,
  },
  faqItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.cards,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  faqQ: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
  },
  faqA: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    lineHeight: 22,
  }
});
