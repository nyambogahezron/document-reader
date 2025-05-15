import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import FileExplorerScreen from '../screens/FileExplorerScreen';
import DocumentViewerScreen from '../screens/DocumentViewerScreen';

// Import hooks
import { useTheme } from '../hooks/useTheme';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// First launch storage key
const FIRST_LAUNCH_KEY = '@DocumentReader:firstLaunch';

// Main bottom tab navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Files"
        component={FileExplorerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator
const AppNavigator = () => {
  const { colors } = useTheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  
  // Check if this is the first launch of the app
  useEffect(() => {
    checkIfFirstLaunch();
  }, []);
  
  // Function to check if this is the first launch
  async function checkIfFirstLaunch() {
    try {
      const value = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      
      if (value === null) {
        // First time launching the app
        setIsFirstLaunch(true);
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
      } else {
        // Not the first time launching the app
        setIsFirstLaunch(false);
      }
    } catch (error) {
      // Error reading from AsyncStorage
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  }
  
  // If the first launch check hasn't completed yet, return null
  if (isFirstLaunch === null) {
    return null;
  }
  
  return (
    <Stack.Navigator
      initialRouteName={isFirstLaunch ? 'Onboarding' : 'Main'}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: 'Inter_600SemiBold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DocumentViewer"
        component={DocumentViewerScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Document',
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;