import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY } from '../theme';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Simulate slight delay for splash screen visibility
      setTimeout(async () => {
        if (user) {
          try {
            // Check admin claim
            const tokenResult = await user.getIdTokenResult();
            if (tokenResult.claims.admin) {
              navigation.replace('AdminApp');
            } else {
              navigation.replace('MainApp');
            }
          } catch (e) {
            navigation.replace('MainApp');
          }
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>THE ARCADE</Text>
      </View>
      <Text style={styles.ghostIcon}>👻</Text>
      <Text style={styles.tagline}>AR Guidance for Gaming Arcades</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    borderWidth: 2,
    borderColor: COLORS.whiteTextPrimary,
    padding: 16,
    marginBottom: 24,
  },
  logoText: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 24,
    color: COLORS.whiteTextPrimary,
    letterSpacing: 2,
  },
  ghostIcon: {
    fontSize: 48,
    color: COLORS.primaryPurple,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  }
});
