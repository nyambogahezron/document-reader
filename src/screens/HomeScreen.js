import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

import { useTheme } from '../hooks/useTheme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '../utils/animationUtils';
import { CATEGORY_ICONS } from '../constants/icons';

// Import components
import SearchBar from '../components/ui/SearchBar';
import CategoryList from '../components/ui/CategoryList';
import DocumentList from '../components/document/DocumentList';
import FloatingActionButton from '../components/ui/FloatingActionButton';

// Mock categories for now - we'll replace this with dynamic data later
const documentCategories = [
	{
		id: 'recent',
		name: 'Recent',
		icon: CATEGORY_ICONS.recent?.name || 'history',
		color: CATEGORY_ICONS.recent?.color || '#4CAF50',
	},
	{
		id: 'pdfs',
		name: 'PDFs',
		icon: CATEGORY_ICONS.pdfs?.name || 'picture-as-pdf',
		color: CATEGORY_ICONS.pdfs?.color || '#F44336',
	},
	{
		id: 'documents',
		name: 'Documents',
		icon: CATEGORY_ICONS.documents?.name || 'description',
		color: CATEGORY_ICONS.documents?.color || '#2196F3',
	},
	{
		id: 'spreadsheets',
		name: 'Spreadsheets',
		icon: CATEGORY_ICONS.spreadsheets?.name || 'grid-on',
		color: CATEGORY_ICONS.spreadsheets?.color || '#4CAF50',
	},
	{
		id: 'presentations',
		name: 'Presentations',
		icon: CATEGORY_ICONS.presentations?.name || 'slideshow',
		color: CATEGORY_ICONS.presentations?.color || '#FF9800',
	},
	{
		id: 'images',
		name: 'Images',
		icon: CATEGORY_ICONS.images?.name || 'image',
		color: CATEGORY_ICONS.images?.color || '#9C27B0',
	},
	{
		id: 'all',
		name: 'All Files',
		icon: CATEGORY_ICONS.all?.name || 'folder',
		color: CATEGORY_ICONS.all?.color || '#607D8B',
	},
];

// Home Screen Component
const HomeScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [recentDocuments, setRecentDocuments] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('recent');
	const [isLoading, setIsLoading] = useState(true);

	// Animation values
	const headerOpacity = useAnimatedValue(0);
	const contentTranslateY = useAnimatedValue(30);

	const styles = makeStyles(colors);

	// Animate components when screen loads
	useEffect(() => {
		Animated.stagger(200, [
			ANIMATION_PRESETS.fadeIn(headerOpacity),
			ANIMATION_PRESETS.slideInUp(contentTranslateY, 30),
		]).start();

		// Simulate loading data
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	// Refresh data when screen is focused
	useFocusEffect(
		useCallback(() => {
			loadRecentDocuments();
			return () => {};
		}, [])
	);

	// Load recent documents
	const loadRecentDocuments = async () => {
		// This would typically be loaded from a service like DocumentService
		// For now, we'll use placeholder data
		setRecentDocuments([]);
	};

	// Handle pull-to-refresh
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadRecentDocuments();
		setRefreshing(false);
	}, []);

	// Handle document import
	const handleImportDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: '*/*',
				copyToCacheDirectory: true,
			});

			if (
				result.canceled === false &&
				result.assets &&
				result.assets.length > 0
			) {
				const asset = result.assets[0];
				console.log('Document selected:', asset);

				// Here we'd normally process the document with DocumentService
				// For now, just navigate to the document viewer
				navigation.navigate('DocumentViewer', {
					uri: asset.uri,
					name: asset.name,
					type: asset.mimeType,
				});
			}
		} catch (error) {
			console.error('Error picking document:', error);
		}
	};

	// Handle search query changes
	const handleSearch = (query) => {
		setSearchQuery(query);
		// Implement search functionality
	};

	// Handle category selection
	const handleCategoryPress = (category) => {
		setSelectedCategory(category.id);
	};

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.header, { opacity: headerOpacity }]}>
				<SearchBar
					placeholder='Search documents...'
					value={searchQuery}
					onChangeText={handleSearch}
				/>
			</Animated.View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[colors.primary]}
					/>
				}
			>
				<Animated.View
					style={{
						transform: [{ translateY: contentTranslateY }],
						opacity: headerOpacity,
					}}
				>
					{/* Category List */}
					<View style={styles.categorySection}>
						<Text style={styles.sectionTitle}>Categories</Text>
						<CategoryList
							categories={documentCategories}
							selectedCategory={selectedCategory}
							onCategoryPress={handleCategoryPress}
						/>
					</View>

					{/* Recent Documents */}
					<View style={styles.documentsSection}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>
								{selectedCategory === 'recent'
									? 'Recent Documents'
									: documentCategories.find(
											(cat) => cat.id === selectedCategory
									  )?.name || 'Documents'}
							</Text>
							{recentDocuments.length > 0 && (
								<TouchableOpacity
									onPress={() => navigation.navigate('FileExplorer')}
								>
									<Text style={styles.viewAllText}>View All</Text>
								</TouchableOpacity>
							)}
						</View>

						<DocumentList
							documents={recentDocuments}
							isLoading={isLoading}
							emptyStateMessage={
								selectedCategory === 'recent'
									? "You haven't opened any documents yet"
									: `No ${
											documentCategories
												.find((cat) => cat.id === selectedCategory)
												?.name.toLowerCase() || 'documents'
									  } found`
							}
							emptyStateIcon={
								selectedCategory === 'recent'
									? 'history'
									: documentCategories.find(
											(cat) => cat.id === selectedCategory
									  )?.icon || 'folder'
							}
							onDocumentPress={(document) => {
								navigation.navigate('DocumentViewer', {
									uri: document.uri,
									name: document.name,
									type: document.type,
								});
							}}
						/>
					</View>
				</Animated.View>
			</ScrollView>

			<FloatingActionButton
				icon='add'
				onPress={handleImportDocument}
				style={styles.fab}
			/>
		</View>
	);
};

const makeStyles = (colors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			paddingHorizontal: 20,
			paddingTop: 45,
			paddingBottom: 8,
			backgroundColor: colors.surface,
		},

		scrollContent: {
			flexGrow: 1,
			paddingBottom: 80,
		},
		categorySection: {
			paddingHorizontal: 20,
			paddingTop: 24,
			paddingBottom: 16,
		},
		documentsSection: {
			paddingHorizontal: 20,
			paddingTop: 24,
			flex: 1,
		},
		sectionHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 16,
		},
		sectionTitle: {
			fontSize: 18,
			fontFamily: 'Inter_600SemiBold',
			color: colors.text,
		},
		viewAllText: {
			fontSize: 14,
			fontFamily: 'Inter_500Medium',
			color: colors.primary,
		},
		fab: {
			position: 'absolute',
			bottom: 24,
			right: 24,
		},
	});

export default HomeScreen;
