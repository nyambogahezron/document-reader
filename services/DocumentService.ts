import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { DocumentInfo } from '../types';
import { FileSystemService } from './FileSystemService';

// Storage keys
const BOOKMARKS_STORAGE_KEY = '@DocumentReader:bookmarks';
const RECENT_DOCUMENTS_STORAGE_KEY = '@DocumentReader:recentDocuments';
const MAX_RECENT_DOCUMENTS = 20;

export class DocumentService {
	/**
	 * Add document to bookmarks
	 */
	static async addBookmark(documentInfo: DocumentInfo): Promise<void> {
		try {
			const bookmarks = await this.getBookmarks();
			const existingIndex = bookmarks.findIndex(
				(doc) => doc.uri === documentInfo.uri
			);

			if (existingIndex === -1) {
				bookmarks.unshift(documentInfo);
				await AsyncStorage.setItem(
					BOOKMARKS_STORAGE_KEY,
					JSON.stringify(bookmarks)
				);
			}
		} catch (error) {
			console.error('Error adding bookmark:', error);
			throw error;
		}
	}

	/**
	 * Remove document from bookmarks
	 */
	static async removeBookmark(uri: string): Promise<void> {
		try {
			const bookmarks = await this.getBookmarks();
			const filteredBookmarks = bookmarks.filter((doc) => doc.uri !== uri);
			await AsyncStorage.setItem(
				BOOKMARKS_STORAGE_KEY,
				JSON.stringify(filteredBookmarks)
			);
		} catch (error) {
			console.error('Error removing bookmark:', error);
			throw error;
		}
	}

	/**
	 * Check if document is bookmarked
	 */
	static async isDocumentBookmarked(uri: string): Promise<boolean> {
		try {
			const bookmarks = await this.getBookmarks();
			return bookmarks.some((doc) => doc.uri === uri);
		} catch (error) {
			console.error('Error checking bookmark status:', error);
			return false;
		}
	}

	/**
	 * Get all bookmarked documents
	 */
	static async getBookmarks(): Promise<DocumentInfo[]> {
		try {
			const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
			return bookmarksJson ? JSON.parse(bookmarksJson) : [];
		} catch (error) {
			console.error('Error getting bookmarks:', error);
			return [];
		}
	}

	/**
	 * Add document to recent documents
	 */
	static async addToRecentDocuments(documentInfo: DocumentInfo): Promise<void> {
		try {
			const recentDocs = await this.getRecentDocuments();

			// Remove if already exists
			const filteredDocs = recentDocs.filter(
				(doc) => doc.uri !== documentInfo.uri
			);

			// Add to beginning
			filteredDocs.unshift(documentInfo);

			// Keep only MAX_RECENT_DOCUMENTS
			const trimmedDocs = filteredDocs.slice(0, MAX_RECENT_DOCUMENTS);

			await AsyncStorage.setItem(
				RECENT_DOCUMENTS_STORAGE_KEY,
				JSON.stringify(trimmedDocs)
			);
		} catch (error) {
			console.error('Error adding to recent documents:', error);
			throw error;
		}
	}

	/**
	 * Get recent documents
	 */
	static async getRecentDocuments(): Promise<DocumentInfo[]> {
		try {
			const recentDocsJson = await AsyncStorage.getItem(
				RECENT_DOCUMENTS_STORAGE_KEY
			);
			return recentDocsJson ? JSON.parse(recentDocsJson) : [];
		} catch (error) {
			console.error('Error getting recent documents:', error);
			return [];
		}
	}

	/**
	 * Share document
	 */
	static async shareDocument(uri: string, name: string): Promise<void> {
		try {
			const isAvailable = await Sharing.isAvailableAsync();
			if (isAvailable) {
				await Sharing.shareAsync(uri, {
					mimeType: 'application/octet-stream',
					dialogTitle: `Share ${name}`,
				});
			} else {
				throw new Error('Sharing is not available on this platform');
			}
		} catch (error) {
			console.error('Error sharing document:', error);
			throw error;
		}
	}

	/**
	 * Get document information
	 */
	static async getDocumentInfo(
		uri: string,
		name: string,
		type: string
	): Promise<DocumentInfo> {
		try {
			// Get actual file information using FileSystemService
			const fileInfo = await FileSystemService.getDocumentInfo(uri);

			if (fileInfo) {
				return fileInfo;
			}

			// Fallback if FileSystemService can't get info
			return {
				name,
				type,
				uri,
				size: 'Unknown',
				lastModified: new Date().toISOString(),
			};
		} catch (error) {
			console.error('Error getting document info:', error);
			throw error;
		}
	}

	/**
	 * Pick document from device
	 */
	static async pickDocument(): Promise<DocumentPicker.DocumentPickerResult | null> {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					'application/pdf',
					'text/*',
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				],
				copyToCacheDirectory: true,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				return result;
			}
			return null;
		} catch (error) {
			console.error('Error picking document:', error);
			throw error;
		}
	}

	/**
	 * Clear recent documents
	 */
	static async clearRecentDocuments(): Promise<void> {
		try {
			await AsyncStorage.setItem(
				RECENT_DOCUMENTS_STORAGE_KEY,
				JSON.stringify([])
			);
		} catch (error) {
			console.error('Error clearing recent documents:', error);
			throw error;
		}
	}

	/**
	 * Get documents by type
	 */
	static async getDocumentsByType(type: string): Promise<DocumentInfo[]> {
		try {
			// This would typically scan the file system for documents of a specific type
			// For now, return empty array as this requires file system access
			return [];
		} catch (error) {
			console.error('Error getting documents by type:', error);
			return [];
		}
	}

	/**
	 * Search documents
	 */
	static async searchDocuments(query: string): Promise<DocumentInfo[]> {
		try {
			// This would typically search through documents
			// For now, search in recent and bookmarked documents
			const recent = await this.getRecentDocuments();
			const bookmarks = await this.getBookmarks();

			const allDocs = [...recent, ...bookmarks];
			const uniqueDocs = allDocs.filter(
				(doc, index, self) => index === self.findIndex((d) => d.uri === doc.uri)
			);

			return uniqueDocs.filter(
				(doc) =>
					doc.name.toLowerCase().includes(query.toLowerCase()) ||
					doc.type.toLowerCase().includes(query.toLowerCase())
			);
		} catch (error) {
			console.error('Error searching documents:', error);
			return [];
		}
	}

	/**
	 * Get all documents by type
	 */
	static async getAllDocumentsByType(): Promise<DocumentInfo[]> {
		try {
			// This would typically return all documents grouped by type
			// For now, return recent documents as a fallback
			return await this.getRecentDocuments();
		} catch (error) {
			console.error('Error getting all documents by type:', error);
			return [];
		}
	}
}
