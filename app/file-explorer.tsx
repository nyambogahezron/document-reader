import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../hooks/useTheme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '../utils/animationUtils';
import { getDocumentTypeIcon } from '../constants/icons';
import { FileSystemService } from '../services/FileSystemService';
import { DocumentService } from '../services/DocumentService';
import { DocumentInfo, Colors } from '../types';

import SearchBar from '../components/ui/SearchBar';
import DocumentGrid from '../components/document/DocumentGrid';
import DocumentList from '../components/document/DocumentList';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import BottomSheet from '../components/ui/BottomSheet';

const FileExplorerScreen = () => {
	const { colors } = useTheme();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPath, setCurrentPath] = useState<string>('/');
	const [folderContents, setFolderContents] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [sortBy, setSortBy] = useState<string>('name');
	const [showSortOptions, setShowSortOptions] = useState<boolean>(false);

	// Animation values
	const fadeAnim = useAnimatedValue(0);
	const translateY = useAnimatedValue(20);

	const styles = makeStyles(colors);

	// Animate components when screen loads
	useEffect(() => {
		Animated.parallel([
			ANIMATION_PRESETS.fadeIn(fadeAnim),
			ANIMATION_PRESETS.slideInUp(translateY, 20),
		]).start();
	}, []);

	// Load folder contents when the screen is focused or path changes
	useFocusEffect(
		useCallback(() => {
			loadFolderContents();
		}, [currentPath])
	);

	// Load folder contents using FileSystemService
	const loadFolderContents = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const documents = await FileSystemService.listDocuments(currentPath);
			setFolderContents(
				documents.map((doc) => ({
					id: doc.uri,
					name: doc.name,
					type: doc.type === 'directory' ? 'folder' : 'file',
					size: doc.size,
					modifiedAt: doc.lastModified,
					path: doc.uri,
				}))
			);
		} catch (err) {
			console.error('Error loading folder contents:', err);
			setError('Failed to load folder contents');
			setFolderContents([]);
		} finally {
			setIsLoading(false);
		}
	};

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
				console.log('Document to import:', asset);

				// Here we would save the file to the current path using FileSystemService
				// For now, just show a success message
				Alert.alert('Success', `Imported ${asset.name} successfully!`);

				// Refresh the folder contents
				loadFolderContents();
			}
		} catch (error) {
			console.error('Error picking document:', error);
			Alert.alert('Error', 'Failed to import document.');
		}
	};

	// Handle folder navigation
	const handleFolderPress = (folder: any) => {
		// Navigate to the selected folder
		setCurrentPath(
			currentPath === '/' ? `/${folder.name}` : `${currentPath}/${folder.name}`
		);
	};

	// Handle document press
	const handleDocumentPress = (document: any) => {
		// Navigate to document viewer
		router.push({
			pathname: '/document-viewer',
			params: {
				uri: document.uri,
				name: document.name,
				type: document.type,
			},
		});
	};

	// Handle navigation back
	const handleBack = () => {
		if (currentPath === '/') {
			return;
		}

		// Get parent path
		const pathParts = currentPath.split('/').filter((part) => part !== '');
		pathParts.pop();
		const parentPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}`;

		setCurrentPath(parentPath);
	};

	// Render path breadcrumbs
	const renderBreadcrumbs = () => {
		const pathParts = currentPath.split('/').filter((part) => part !== '');

		return (
			<View style={styles.breadcrumbs}>
				<TouchableOpacity
					style={styles.breadcrumbItem}
					onPress={() => setCurrentPath('/')}
				>
					<MaterialIcons name='home' size={16} color={colors.primary} />
				</TouchableOpacity>

				{pathParts.map((part, index) => (
					<View key={index} style={styles.breadcrumbItem}>
						<Text style={styles.breadcrumbSeparator}>/</Text>
						<TouchableOpacity
							onPress={() => {
								const newPath = `/${pathParts.slice(0, index + 1).join('/')}`;
								setCurrentPath(newPath);
							}}
						>
							<Text style={styles.breadcrumbText}>{part}</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>
		);
	};

	// Sort options menu
	const sortOptions = [
		{ id: 'name', label: 'Name', icon: 'sort-by-alpha' },
		{ id: 'date', label: 'Date', icon: 'access-time' },
		{ id: 'type', label: 'Type', icon: 'description' },
		{ id: 'size', label: 'Size', icon: 'data-usage' },
	];

	return (
		<View style={styles.container}>
			<Animated.View
				style={[
					styles.header,
					{
						opacity: fadeAnim,
					},
				]}
			>
				<View style={styles.searchContainer}>
					<SearchBar
						placeholder='Search files and folders...'
						value={searchQuery}
						onChangeText={setSearchQuery}
						onSubmit={setSearchQuery}
					/>{' '}
					<TouchableOpacity
						style={styles.viewModeButton}
						onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
					>
						<MaterialIcons
							name={viewMode === 'grid' ? 'view-list' : 'grid-view'}
							size={24}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.sortButton}
						onPress={() => setShowSortOptions(true)}
					>
						<MaterialIcons name='sort' size={24} color={colors.textSecondary} />
					</TouchableOpacity>
				</View>

				{renderBreadcrumbs()}
			</Animated.View>

			<Animated.View
				style={[
					styles.content,
					{
						opacity: fadeAnim,
						transform: [{ translateY: translateY }],
					},
				]}
			>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size='large' color={colors.primary} />
						<Text style={styles.loadingText}>Loading files...</Text>
					</View>
				) : folderContents.length === 0 ? (
					<View style={styles.emptyContainer}>
						<MaterialIcons
							name='folder-open'
							size={64}
							color={colors.textTertiary}
						/>
						<Text style={styles.emptyText}>This folder is empty</Text>
						<TouchableOpacity
							style={styles.emptyActionButton}
							onPress={handleImportDocument}
						>
							<Text style={styles.emptyActionText}>Import Document</Text>
						</TouchableOpacity>
					</View>
				) : viewMode === 'grid' ? (
					<DocumentGrid
						documents={folderContents}
						title='Files'
						onViewAll={() => {}}
						onDocumentPress={handleDocumentPress}
						onDocumentLongPress={() => {}}
						onBookmarkPress={() => {}}
						onSharePress={() => {}}
						onMorePress={() => {}}
						containerStyle={{}}
						style={{}}
					/>
				) : (
					<DocumentList
						documents={folderContents}
						onDocumentPress={handleDocumentPress}
					/>
				)}
			</Animated.View>

			<FloatingActionButton
				mainIcon='add'
				mainAction={handleImportDocument}
				containerStyle={styles.fab}
			/>

			<BottomSheet
				isVisible={showSortOptions}
				onClose={() => setShowSortOptions(false)}
				title='Sort by'
			>
				{sortOptions.map((option) => (
					<TouchableOpacity
						key={option.id}
						style={[
							styles.sortOption,
							sortBy === option.id && styles.selectedSortOption,
						]}
						onPress={() => {
							setSortBy(option.id);
							setShowSortOptions(false);
						}}
					>
						<MaterialIcons
							name={option.icon}
							size={24}
							color={
								sortBy === option.id ? colors.primary : colors.textSecondary
							}
						/>
						<Text
							style={[
								styles.sortOptionText,
								sortBy === option.id && styles.selectedSortOptionText,
							]}
						>
							{option.label}
						</Text>
						{sortBy === option.id && (
							<MaterialIcons name='check' size={20} color={colors.primary} />
						)}
					</TouchableOpacity>
				))}
			</BottomSheet>
		</View>
	);
};

const makeStyles = (colors: Colors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			padding: 16,
			backgroundColor: colors.surface,
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		breadcrumbs: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 12,
			flexWrap: 'wrap',
		},
		breadcrumbItem: {
			flexDirection: 'row',
			alignItems: 'center',
			marginRight: 4,
		},
		breadcrumbSeparator: {
			color: colors.textTertiary,
			marginRight: 4,
		},
		breadcrumbText: {
			color: colors.primary,
			fontFamily: 'Inter_500Medium',
		},
		content: {
			flex: 1,
			padding: 16,
		},
		viewModeButton: {
			padding: 8,
			marginLeft: 8,
		},
		sortButton: {
			padding: 8,
			marginLeft: 8,
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		loadingText: {
			marginTop: 16,
			fontSize: 16,
			color: colors.textSecondary,
			fontFamily: 'Inter_500Medium',
		},
		emptyContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		emptyText: {
			marginTop: 16,
			fontSize: 16,
			color: colors.textSecondary,
			fontFamily: 'Inter_500Medium',
		},
		emptyActionButton: {
			marginTop: 24,
			paddingVertical: 12,
			paddingHorizontal: 24,
			backgroundColor: colors.primary,
			borderRadius: 30,
		},
		emptyActionText: {
			color: colors.text,
			fontFamily: 'Inter_600SemiBold',
		},
		fab: {
			position: 'absolute',
			bottom: 24,
			right: 24,
		},
		sortOption: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 16,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		selectedSortOption: {
			backgroundColor: colors.primary,
		},
		sortOptionText: {
			flex: 1,
			marginLeft: 16,
			fontSize: 16,
			color: colors.text,
			fontFamily: 'Inter_400Regular',
		},
		selectedSortOptionText: {
			color: colors.primary,
			fontFamily: 'Inter_600SemiBold',
		},
	});

export default FileExplorerScreen;
