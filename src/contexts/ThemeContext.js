import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

// Theme context with default values
export const ThemeContext = createContext({
  isDark: false,
  colors: lightTheme,
  setScheme: () => {},
});

// Theme storage key in AsyncStorage
const THEME_PREFERENCE_KEY = '@document_reader:theme_preference';

/**
 * Theme provider component that manages and provides theme context
 */
export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  
  // State for current theme
  const [isDark, setIsDark] = useState(deviceColorScheme === 'dark');
  
  // Load saved theme preference when component mounts
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  // Load theme preference from storage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      
      // If user has set a preference, use it
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };
  
  // Save theme preference to storage
  const saveThemePreference = async (scheme) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, scheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Function to set color scheme
  const setScheme = (scheme) => {
    // Save theme preference
    saveThemePreference(scheme);
    
    // Update state
    setIsDark(scheme === 'dark');
  };
  
  // Get the active theme colors
  const activeColors = isDark ? darkTheme : lightTheme;
  
  // Context value to provide
  const themeContext = {
    isDark,
    colors: activeColors,
    setScheme,
  };
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};