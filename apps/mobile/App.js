import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { 
  Montserrat_400Regular, 
  Montserrat_500Medium, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
// Admin
import AdminLoginScreen from './src/screens/admin/AdminLoginScreen';
// Navigators
import MainNavigator from './src/navigation/MainNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import InactivityDetector from './src/components/ui/InactivityDetector';

import { COLORS } from './src/theme';

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.backgroundBase,
    card: COLORS.cardBackground,
    text: COLORS.whiteTextPrimary,
    border: COLORS.borderSubtle,
    primary: COLORS.primaryPurple,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.backgroundBase, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primaryPurple} />
      </View>
    );
  }

  const AppContent = (
    <InactivityDetector timeoutMs={60000}>
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="MainApp" component={MainNavigator} />
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </InactivityDetector>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 480, height: '100%', backgroundColor: COLORS.backgroundBase, overflow: 'hidden' }}>
          {AppContent}
        </View>
      </View>
    );
  }

  return AppContent;
}
