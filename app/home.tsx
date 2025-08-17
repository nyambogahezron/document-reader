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
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '@/utils/animationUtils';
import { CATEGORY_ICONS } from '@/constants/icons';
import { DocumentService } from '@/services/DocumentService';
import { DocumentInfo, Colors } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import CategoryList from '@/components/ui/CategoryList';
import DocumentList from '@/components/document/DocumentList';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
interface documentCategoriesType {
	id: string;
	name: string;
	icon: any;
	color: any;
}

const documentCategories: documentCategoriesType[] = [
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

export default function HomeScreen() {
	const { colors } = useTheme();
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [recentDocuments, setRecentDocuments] = useState<DocumentInfo[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('recent');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const headerOpacity = useAnimatedValue(0);
	const contentTranslateY = useAnimatedValue(30);

	const styles = makeStyles(colors);

	useEffect(() => {
		Animated.stagger(200, [
			ANIMATION_PRESETS.fadeIn(headerOpacity),
			ANIMATION_PRESETS.slideInUp(contentTranslateY, 30),
		]).start();

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadRecentDocuments();
			return () => {};
		}, [])
	);

	const loadRecentDocuments = async () => {
		try {
			setIsLoading(true);
			const documents = await DocumentService.getRecentDocuments();
			setRecentDocuments(documents);
		} catch (error) {
			console.error('Error loading recent documents:', error);
			setRecentDocuments([]);
		} finally {
			setIsLoading(false);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadRecentDocuments();
		setRefreshing(false);
	}, []);

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

				router.push({
					pathname: '/document-viewer',
					params: {
						uri: asset.uri,
						name: asset.name,
						type: asset.mimeType || '',
					},
				});
			}
		} catch (error) {
			console.error('Error picking document:', error);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		// TODO: Implement search functionality
	};

	const handleCategoryPress = (category: any) => {
		setSelectedCategory(category.id);
	};

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.header, { opacity: headerOpacity }]}>
				<SearchBar
					placeholder='Search documents...'
					value={searchQuery}
					onChangeText={handleSearch}
					onSubmit={handleSearch}
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
							onSelectCategory={handleCategoryPress}
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
								<TouchableOpacity onPress={() => router.push('/file-explorer')}>
									<Text style={styles.viewAllText}>View All</Text>
								</TouchableOpacity>
							)}
						</View>

						<DocumentList
							documents={recentDocuments as any}
							isLoading={isLoading}
							emptyMessage={
								selectedCategory === 'recent'
									? "You haven't opened any documents yet"
									: `No ${
											documentCategories
												.find((cat) => cat.id === selectedCategory)
												?.name.toLowerCase() || 'documents'
									  } found`
							}
							onDocumentPress={(document) => {
								router.push({
									pathname: '/document-viewer',
									params: {
										uri: document.uri,
										name: document.name,
										type: document.type,
									},
								});
							}}
						/>
					</View>
				</Animated.View>
			</ScrollView>

			<FloatingActionButton
				mainIcon='add'
				mainAction={handleImportDocument}
				containerStyle={styles.fab}
			/>
		</View>
	);
}

const makeStyles = (colors: Colors) =>
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
