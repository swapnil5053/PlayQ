import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { PrimaryButton } from '../components/ui/Buttons';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // SplashScreen listener will automatically redirect to MainApp/Admin
    } catch (e) {
      setError(e.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to your arcade account</Text>
        </View>

        <View style={styles.formContainer}>
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
                placeholder="Password"
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading}
            style={{ marginTop: SPACING.md }}
          />

          <TouchableOpacity style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpTextHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.adminLink} onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.adminLinkText}>Admin? Login here</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  content: {
    flex: 1,
    padding: SPACING.xxxl,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: SPACING.massive,
  },
  headerTitle: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 28,
    color: COLORS.whiteTextPrimary,
    marginBottom: SPACING.sm,
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
  signUpLink: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
  },
  signUpTextHighlight: {
    color: COLORS.primaryPurple,
    fontFamily: 'Montserrat_600SemiBold',
  },
  adminLink: {
    position: 'absolute',
    bottom: SPACING.xxxl,
    alignSelf: 'center',
  },
  adminLinkText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.greyTextTertiary,
  }
});
