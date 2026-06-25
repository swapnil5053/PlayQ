import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { PrimaryButton } from '../components/ui/Buttons';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update profile with display name
      await updateProfile(user, { displayName });

      // 3. Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        favorites: []
      });

      // User is logged in, SplashScreen listener will auto-redirect
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color={COLORS.whiteTextPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join the arcade community</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Display Name"
                placeholderTextColor={COLORS.greyTextTertiary}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={COLORS.greyTextTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password (min 8 chars)"
                  placeholderTextColor={COLORS.greyTextTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.greyTextTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.greyTextTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <PrimaryButton 
              title="Create Account" 
              onPress={handleSignUp} 
              loading={loading}
              style={{ marginTop: SPACING.sm }}
            />

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xxxl,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: SPACING.massive,
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: -10,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 28,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.inputs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    color: COLORS.whiteTextPrimary,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.inputs,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    color: COLORS.whiteTextPrimary,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
  },
  eyeIcon: {
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.redHighWait,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  loginLink: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  loginTextHighlight: {
    color: COLORS.primaryPurple,
    fontFamily: 'Montserrat_600SemiBold',
  }
});
