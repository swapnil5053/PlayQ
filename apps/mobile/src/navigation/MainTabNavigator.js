import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import AccountScreen from '../screens/AccountScreen';
import SupportScreen from '../screens/SupportScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F0F18',
          borderTopWidth: 1,
          borderTopColor: COLORS.borderSubtle,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: COLORS.primaryPurple,
        tabBarInactiveTintColor: COLORS.greyTextTertiary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="map" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Discovery" 
        component={DiscoveryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="compass" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="help-circle" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
