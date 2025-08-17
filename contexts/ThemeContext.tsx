import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';
import { ThemeContextType, Colors } from '../types';

// Theme storage key in AsyncStorage
const THEME_PREFERENCE_KEY = '@document_reader:theme_preference';

// Theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	colors: lightTheme,
	setScheme: () => {},
});

interface ThemeProviderProps {
	children: ReactNode;
}

/**
 * Theme provider component that manages and provides theme context
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	// Get device color scheme
	const deviceColorScheme = useColorScheme();

	// State for current theme
	const [isDark, setIsDark] = useState<boolean>(deviceColorScheme === 'dark');
	const [isInitialized, setIsInitialized] = useState<boolean>(false);

	// Load saved theme preference when component mounts
	useEffect(() => {
		loadThemePreference();
	}, []);

	// Load theme preference from storage
	const loadThemePreference = async (): Promise<void> => {
		try {
			const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);

			// If user has set a preference, use it
			if (savedTheme !== null) {
				setIsDark(savedTheme === 'dark');
			} else {
				// Use system preference if no saved preference
				setIsDark(deviceColorScheme === 'dark');
			}

			setIsInitialized(true);
		} catch (error) {
			console.error('Error loading theme preference:', error);
			setIsDark(deviceColorScheme === 'dark');
			setIsInitialized(true);
		}
	};

	// Save theme preference to storage
	const saveThemePreference = async (scheme: string): Promise<void> => {
		try {
			await AsyncStorage.setItem(THEME_PREFERENCE_KEY, scheme);
		} catch (error) {
			console.error('Error saving theme preference:', error);
		}
	};

	// Function to set color scheme
	const setScheme = (scheme: 'light' | 'dark' | 'auto'): void => {
		if (scheme === 'auto') {
			// Use system preference
			setIsDark(deviceColorScheme === 'dark');
			saveThemePreference('auto');
		} else {
			// Use explicit preference
			setIsDark(scheme === 'dark');
			saveThemePreference(scheme);
		}
	};

	// Get the active theme colors
	const activeColors: Colors = isDark ? darkTheme : lightTheme;

	// Context value to provide
	const themeContext: ThemeContextType = {
		isDark,
		colors: activeColors,
		setScheme,
	};

	// Don't render until theme is initialized to prevent flash
	if (!isInitialized) {
		return null;
	}

	return (
		<ThemeContext.Provider value={themeContext}>
			{children}
		</ThemeContext.Provider>
	);
};
