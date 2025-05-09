import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDocumentTypeIcon } from '../constants/icons';
import { useTheme } from '../hooks/useTheme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '../utils/animationUtils';
import { getFileExtension } from '../utils/fileFormatUtils';
import { useRoute } from '@react-navigation/native';

const DocumentViewerScreen = () => {
	const;

	const { uri, name, type } = useRoute().params as any;
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();

	// States
	const [isLoading, setIsLoading] = useState(true);
	const [showControls, setShowControls] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [documentInfo, setDocumentInfo] = useState(null);
	const [error, setError] = useState(null);

	// File extension
	const fileExtension = getFileExtension(name || '');

	// Get document type icon
	const docIcon = getDocumentTypeIcon(fileExtension);

	// Animation values
	const fadeAnim = useAnimatedValue(1);
	const controlsTranslateY = useAnimatedValue(0);

	// Styles
	const styles = makeStyles(colors, insets);

	// Load document
	useEffect(() => {
		const loadDocument = async () => {
			if (!uri) {
				setError('No document URI provided');
				setIsLoading(false);
				return;
			}

			try {
				// In a real implementation, we would load document info from DocumentService
				// For now, just simulate loading
				setTimeout(() => {
					setDocumentInfo({
						name,
						type,
						uri,
						size: '2.5 MB',
						lastModified: new Date().toISOString(),
					});
					setIsLoading(false);
				}, 1000);

				// Check if document is bookmarked
				// This would typically use DocumentService.isDocumentBookmarked(uri)
				setIsBookmarked(false);
			} catch (error) {
				console.error('Error loading document:', error);
				setError('Failed to load document');
				setIsLoading(false);
			}
		};

		loadDocument();
	}, [uri, name, type]);

	// Handle page change
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Toggle controls visibility
	const toggleControls = () => {
		if (showControls) {
			// Hide controls
			Animated.parallel([
				ANIMATION_PRESETS.fadeOut(fadeAnim),
				Animated.timing(controlsTranslateY, {
					toValue: -100,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			// Show controls
			Animated.parallel([
				ANIMATION_PRESETS.fadeIn(fadeAnim),
				Animated.timing(controlsTranslateY, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}

		setShowControls(!showControls);
	};

	// Toggle bookmark
	const toggleBookmark = async () => {
		try {
			// In a real implementation, we would update bookmark status in DocumentService
			setIsBookmarked(!isBookmarked);

			// Show feedback
			Alert.alert(
				isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks',
				isBookmarked
					? `${name} has been removed from your bookmarks.`
					: `${name} has been added to your bookmarks.`,
				[{ text: 'OK' }],
				{ cancelable: true }
			);
		} catch (error) {
			console.error('Error toggling bookmark:', error);
		}
	};

	// Handle share
	const handleShare = async () => {
		try {
			// In a real implementation, we would share using FileSystemService
			Alert.alert('Share', `Sharing ${name}...`);
		} catch (error) {
			console.error('Error sharing document:', error);
		}
	};

	// Render document controls
	const renderControls = () => {
		return (
			<Animated.View
				style={[
					styles.controlsContainer,
					{
						opacity: fadeAnim,
						transform: [{ translateY: controlsTranslateY }],
					},
				]}
			>
				<View style={styles.topBar}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<MaterialIcons name='arrow-back' size={24} color={colors.primary} />
					</TouchableOpacity>

					<View style={styles.documentInfo}>
						<Text style={styles.documentName} numberOfLines={1}>
							{name}
						</Text>
						<Text style={styles.documentType}>
							{fileExtension.toUpperCase()}
						</Text>
					</View>

					<View style={styles.actionButtons}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={toggleBookmark}
						>
							<MaterialIcons
								name={isBookmarked ? 'bookmark' : 'bookmark-border'}
								size={24}
								color={isBookmarked ? colors.accent : colors.primary}
							/>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton} onPress={handleShare}>
							<MaterialIcons name='share' size={24} color={colors.primary} />
						</TouchableOpacity>
					</View>
				</View>

				{totalPages > 1 && (
					<View style={styles.paginationContainer}>
						<TouchableOpacity
							style={[
								styles.paginationButton,
								currentPage === 1 && styles.disabledButton,
							]}
							onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
						>
							<MaterialIcons
								name='chevron-left'
								size={24}
								color={currentPage === 1 ? colors.textTertiary : colors.primary}
							/>
						</TouchableOpacity>

						<Text style={styles.paginationText}>
							{currentPage} / {totalPages}
						</Text>

						<TouchableOpacity
							style={[
								styles.paginationButton,
								currentPage === totalPages && styles.disabledButton,
							]}
							onPress={() =>
								handlePageChange(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
						>
							<MaterialIcons
								name='chevron-right'
								size={24}
								color={
									currentPage === totalPages
										? colors.textTertiary
										: colors.primary
								}
							/>
						</TouchableOpacity>
					</View>
				)}
			</Animated.View>
		);
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color={colors.primary} />
				<Text style={styles.loadingText}>Loading document...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<MaterialIcons name='error-outline' size={64} color={colors.error} />
				<Text style={styles.errorTitle}>Error Loading Document</Text>
				<Text style={styles.errorMessage}>{error}</Text>
				<TouchableOpacity
					style={styles.errorButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.errorButtonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Document Content */}
			<TouchableOpacity
				activeOpacity={1}
				onPress={toggleControls}
				style={styles.documentContainer}
			>
				<DocumentViewer
					uri={uri}
					type={fileExtension}
					onPageChange={handlePageChange}
					onLoadComplete={(total) => setTotalPages(total)}
					onError={(error) => setError(error.message)}
				/>
			</TouchableOpacity>

			{/* Controls */}
			{renderControls()}
		</View>
	);
};

const makeStyles = (colors, insets) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		documentContainer: {
			flex: 1,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: 16,
			fontSize: 16,
			color: colors.textSecondary,
			fontFamily: 'Inter_500Medium',
		},
		errorContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 24,
			backgroundColor: colors.background,
		},
		errorTitle: {
			fontSize: 20,
			fontFamily: 'Inter_600SemiBold',
			color: colors.text,
			marginTop: 16,
			marginBottom: 8,
		},
		errorMessage: {
			fontSize: 16,
			fontFamily: 'Inter_400Regular',
			color: colors.textSecondary,
			textAlign: 'center',
			marginBottom: 24,
		},
		errorButton: {
			paddingVertical: 12,
			paddingHorizontal: 24,
			backgroundColor: colors.primary,
			borderRadius: 30,
		},
		errorButtonText: {
			color: colors.textInverse,
			fontFamily: 'Inter_600SemiBold',
			fontSize: 16,
		},
		controlsContainer: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			paddingTop: insets.top,
		},
		topBar: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 16,
			backgroundColor: colors.surface + 'E6', // Add opacity
		},
		backButton: {
			width: 40,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
		},
		documentInfo: {
			flex: 1,
			marginHorizontal: 16,
		},
		documentName: {
			fontSize: 16,
			fontFamily: 'Inter_600SemiBold',
			color: colors.text,
			marginBottom: 4,
		},
		documentType: {
			fontSize: 12,
			fontFamily: 'Inter_400Regular',
			color: colors.textSecondary,
		},
		actionButtons: {
			flexDirection: 'row',
		},
		actionButton: {
			width: 40,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			marginLeft: 8,
		},
		paginationContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 16,
			backgroundColor: colors.surface + 'E6', // Add opacity
			borderTopWidth: 1,
			borderTopColor: colors.border + '80', // Add opacity
		},
		paginationButton: {
			width: 40,
			height: 40,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 20,
		},
		disabledButton: {
			opacity: 0.5,
		},
		paginationText: {
			fontSize: 14,
			fontFamily: 'Inter_500Medium',
			color: colors.text,
			marginHorizontal: 16,
		},
	});

export default DocumentViewerScreen;
