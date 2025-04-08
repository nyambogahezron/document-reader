import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
	useFonts,
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from '@expo-google-fonts/inter';

// Import contexts
import { ThemeProvider } from './src/contexts/ThemeContext';

// Import navigator
import AppNavigator from './src/navigation/AppNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);

	// Load fonts
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	// Prepare the app
	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load any data or assets here
				// For example, initialize services

				// Artificially delay for two seconds
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	// Handle layout when app is ready
	const onLayoutRootView = useCallback(async () => {
		if (appIsReady && fontsLoaded) {
			// This tells the splash screen to hide immediately
			await SplashScreen.hideAsync();
		}
	}, [appIsReady, fontsLoaded]);

	// Show loading screen if app is not ready or fonts are not loaded
	if (!appIsReady || !fontsLoaded) {
		return null;
	}

	return (
		<ThemeProvider>
			<View style={styles.container} onLayout={onLayoutRootView}>
				<NavigationContainer>
					<AppNavigator />
				</NavigationContainer>
				<StatusBar style='auto' />
			</View>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
