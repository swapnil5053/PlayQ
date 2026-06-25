import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { PrimaryButton } from '../../components/ui/Buttons';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // Verify custom claim or we wait for SplashScreen to do it
      const tokenResult = await userCred.user.getIdTokenResult();
      if (!tokenResult.claims.admin) {
        throw new Error('User does not have admin privileges');
      }
      navigation.replace('AdminApp');
    } catch (e) {
      setError(e.message || 'Failed to sign in as admin');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="x" size={28} color={COLORS.whiteTextPrimary} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Staff Access</Text>
          <Text style={styles.headerSubtitle}>Authorized personnel only</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Admin Email"
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
                placeholder="Admin Password"
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
            title="Authenticate" 
            onPress={handleAdminLogin} 
            loading={loading}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
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
    color: COLORS.redHighWait, // Give it a red tint for warning
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
  }
});
