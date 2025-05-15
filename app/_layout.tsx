import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { ThemeProvider } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: '#f5f5f5',
				},
				headerTintColor: '#000',
				headerTitleStyle: {
					fontFamily: 'Inter_600SemiBold',
				},
			}}
		>
			<Stack.Screen name='index' options={{ headerShown: false }} />
			<Stack.Screen name='home' options={{ title: 'Home' }} />
			<Stack.Screen
				name='document-viewer'
				options={{ title: 'Document Viewer' }}
			/>
			<Stack.Screen name='file-explorer' options={{ title: 'File Explorer' }} />
		</Stack>
	);
}

export default function App() {
	const [appIsReady, setAppIsReady] = React.useState(false);

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
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady && fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady, fontsLoaded]);

	if (!appIsReady || !fontsLoaded) {
		return null;
	}

	return (
		<ThemeProvider>
			<View style={{ flex: 1 }} onLayout={onLayoutRootView}>
				<RootLayout />
			</View>
		</ThemeProvider>
	);
}
