import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, TYPOGRAPHY } from '../theme';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import GameManagementScreen from '../screens/admin/GameManagementScreen';
import QueueManagementScreen from '../screens/admin/QueueManagementScreen';
import ScoreEntryScreen from '../screens/admin/ScoreEntryScreen';
import FeaturedGameScreen from '../screens/admin/FeaturedGameScreen';
import UserListScreen from '../screens/admin/UserListScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.backgroundBase,
        },
        headerTintColor: COLORS.whiteTextPrimary,
        headerTitleStyle: {
          fontFamily: TYPOGRAPHY.h1.fontFamily,
          fontSize: 18,
        },
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Panel', headerLeft: () => null }} />
      <Stack.Screen name="GameManagement" component={GameManagementScreen} options={{ title: 'Game Management' }} />
      <Stack.Screen name="QueueManagement" component={QueueManagementScreen} options={{ title: 'Queue Management' }} />
      <Stack.Screen name="ScoreEntry" component={ScoreEntryScreen} options={{ title: 'Score Entry' }} />
      <Stack.Screen name="FeaturedGame" component={FeaturedGameScreen} options={{ title: 'Featured Game' }} />
      <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'User List' }} />
    </Stack.Navigator>
  );
}
