import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getDocumentTypeIcon } from '@/constants/icons';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '@/utils/animationUtils';
import { getFileExtension } from '@/utils/fileFormatUtils';
import { DocumentService } from '@/services/DocumentService';
import DocumentViewer from '@/components/document/DocumentViewer';
import {
	DocumentInfo,
	DocumentViewerParams,
	ThemeContextType,
	SafeAreaInsets,
	Colors,
} from '../types';

const DocumentViewerScreen = () => {
	const { uri, name, type } = useRoute().params as DocumentViewerParams;
	const navigation = useNavigation();
	const { colors } = useTheme() as ThemeContextType;
	const insets = useSafeAreaInsets();

	// States
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showControls, setShowControls] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
	const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
	const [error, setError] = useState<string | null>(null);

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
				// Get document info using DocumentService
				const docInfo = await DocumentService.getDocumentInfo(uri, name, type);
				setDocumentInfo(docInfo);

				// Add to recent documents
				await DocumentService.addToRecentDocuments(docInfo);

				// Check if document is bookmarked
				const bookmarked = await DocumentService.isDocumentBookmarked(uri);
				setIsBookmarked(bookmarked);

				setIsLoading(false);
			} catch (error) {
				console.error('Error loading document:', error);
				setError('Failed to load document');
				setIsLoading(false);
			}
		};

		loadDocument();
	}, [uri, name, type]);

	// Handle page change
	const handlePageChange = (page: number) => {
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
			if (isBookmarked) {
				await DocumentService.removeBookmark(uri);
			} else {
				if (documentInfo) {
					await DocumentService.addBookmark(documentInfo);
				}
			}
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
			Alert.alert('Error', 'Failed to update bookmark status');
		}
	};

	// Handle share
	const handleShare = async () => {
		try {
			await DocumentService.shareDocument(uri, name);
		} catch (error) {
			console.error('Error sharing document:', error);
			Alert.alert('Error', 'Failed to share document');
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
								color={isBookmarked ? colors.secondary : colors.primary}
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
					fileName={name}
					onLoadStart={() => setIsLoading(true)}
					onLoadEnd={() => setIsLoading(false)}
					onError={(error: any) =>
						setError(error?.message || 'Failed to load document')
					}
					onPageChanged={(page: number, total: number) => {
						setCurrentPage(page);
						setTotalPages(total);
					}}
				/>
			</TouchableOpacity>

			{/* Controls */}
			{renderControls()}
		</View>
	);
};

const makeStyles = (colors: Colors, insets: SafeAreaInsets) =>
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
			color: colors.text,
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
