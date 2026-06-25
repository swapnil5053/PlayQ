import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import GameDetailScreen from '../screens/GameDetailScreen';
import ConciergeScreen from '../screens/ConciergeScreen';
import ScoresScreen from '../screens/ScoresScreen';
import ARNavigationScreen from '../screens/ARNavigationScreen';
import CompareScreen from '../screens/CompareScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} />
      <Stack.Screen name="Concierge" component={ConciergeScreen} />
      <Stack.Screen name="Scores" component={ScoresScreen} />
      <Stack.Screen name="ARNavigation" component={ARNavigationScreen} />
      <Stack.Screen name="Compare" component={CompareScreen} />
    </Stack.Navigator>
  );
}
