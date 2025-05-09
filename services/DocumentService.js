import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { FileSystemService } from './FileSystemService';
import {
	getFileExtension,
	isDocumentSupported,
} from '../utils/fileFormatUtils';

// Storage keys
const BOOKMARKS_STORAGE_KEY = '@DocumentReader:bookmarks';
const RECENT_DOCUMENTS_STORAGE_KEY = '@DocumentReader:recentDocuments';
const MAX_RECENT_DOCUMENTS = 20;

/**
 * Service for handling document operations
 */
class DocumentServiceClass {
	constructor() {
		this.initializeService();
	}

	/**
	 * Initialize the document service
	 */
	async initializeService() {
		try {
			// Initialize FileSystemService
			await FileSystemService.initializeDocumentDirectory();

			// Ensure storage is initialized
			const bookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
			if (bookmarks === null) {
				await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify([]));
			}

			const recentDocuments = await AsyncStorage.getItem(
				RECENT_DOCUMENTS_STORAGE_KEY
			);
			if (recentDocuments === null) {
				await AsyncStorage.setItem(
					RECENT_DOCUMENTS_STORAGE_KEY,
					JSON.stringify([])
				);
			}
		} catch (error) {
			console.error('Error initializing DocumentService:', error);
		}
	}

	/**
	 * Import a document using document picker
	 * @returns {Promise<object>} Imported document info
	 */
	async importDocument(documentResult) {
		try {
			let result;

			// If a document is already selected (passed as parameter)
			if (documentResult) {
				result = documentResult;
			} else {
				// Open document picker
				result = await DocumentPicker.getDocumentAsync({
					type: '*/*',
					copyToCacheDirectory: true,
				});
			}

			// Check if user canceled the operation
			if (result.canceled) {
				return null;
			}

			// Get the selected asset
			const asset = result.assets[0];

			// Check if file is supported
			const fileExtension = getFileExtension(asset.name);
			if (!isDocumentSupported(fileExtension)) {
				throw new Error(`File type .${fileExtension} is not supported`);
			}

			// Save file to document directory
			const savedUri = await FileSystemService.saveFile(
				asset.uri,
				asset.name,
				FileSystemService.getDocumentDirectoryPath()
			);

			// Get document info
			const documentInfo = await FileSystemService.getDocumentInfo(savedUri);

			// Add to recent documents
			await this.addToRecentDocuments(documentInfo);

			return documentInfo;
		} catch (error) {
			console.error('Error importing document:', error);
			throw error;
		}
	}

	/**
	 * Get information about a document
	 * @param {string} uri - URI of the document
	 * @returns {Promise<object>} Document information
	 */
	async getDocumentInfo(uri) {
		try {
			return await FileSystemService.getDocumentInfo(uri);
		} catch (error) {
			console.error('Error getting document info:', error);
			throw error;
		}
	}

	/**
	 * Read content of a text file
	 * @param {string} uri - URI of the text file
	 * @returns {Promise<string>} Content of the file
	 */
	async readTextFile(uri) {
		try {
			return await FileSystemService.readTextFile(uri);
		} catch (error) {
			console.error('Error reading text file:', error);
			throw error;
		}
	}

	/**
	 * Add a document to bookmarks
	 * @param {string} uri - URI of the document
	 * @param {string} name - Name of the document
	 * @param {string} type - Type of the document
	 * @returns {Promise<boolean>} True if added successfully
	 */
	async addBookmark(uri, name, type) {
		try {
			// Get current bookmarks
			const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
			let bookmarks = JSON.parse(bookmarksJson) || [];

			// Check if already bookmarked
			const existing = bookmarks.find((item) => item.uri === uri);
			if (existing) {
				return true; // Already bookmarked
			}

			// Add to bookmarks
			bookmarks.push({
				uri,
				name,
				type,
				addedAt: Date.now(),
			});

			// Save updated bookmarks
			await AsyncStorage.setItem(
				BOOKMARKS_STORAGE_KEY,
				JSON.stringify(bookmarks)
			);

			return true;
		} catch (error) {
			console.error('Error adding bookmark:', error);
			return false;
		}
	}

	/**
	 * Remove a document from bookmarks
	 * @param {string} uri - URI of the document
	 * @returns {Promise<boolean>} True if removed successfully
	 */
	async removeBookmark(uri) {
		try {
			// Get current bookmarks
			const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
			let bookmarks = JSON.parse(bookmarksJson) || [];

			// Remove the specified bookmark
			bookmarks = bookmarks.filter((item) => item.uri !== uri);

			// Save updated bookmarks
			await AsyncStorage.setItem(
				BOOKMARKS_STORAGE_KEY,
				JSON.stringify(bookmarks)
			);

			return true;
		} catch (error) {
			console.error('Error removing bookmark:', error);
			return false;
		}
	}

	/**
	 * Get all bookmarks
	 * @returns {Promise<Array>} Array of bookmarked documents
	 */
	async getBookmarks() {
		try {
			const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
			return JSON.parse(bookmarksJson) || [];
		} catch (error) {
			console.error('Error getting bookmarks:', error);
			return [];
		}
	}

	/**
	 * Check if a document is bookmarked
	 * @param {string} uri - URI of the document
	 * @returns {Promise<boolean>} True if bookmarked
	 */
	async isDocumentBookmarked(uri) {
		try {
			const bookmarks = await this.getBookmarks();
			return bookmarks.some((item) => item.uri === uri);
		} catch (error) {
			console.error('Error checking if document is bookmarked:', error);
			return false;
		}
	}

	/**
	 * Add a document to recent documents
	 * @param {object} document - Document information
	 * @returns {Promise<boolean>} True if added successfully
	 */
	async addToRecentDocuments(document) {
		try {
			// Get current recent documents
			const recentJson = await AsyncStorage.getItem(
				RECENT_DOCUMENTS_STORAGE_KEY
			);
			let recentDocuments = JSON.parse(recentJson) || [];

			// Check if already in recent documents
			const existingIndex = recentDocuments.findIndex(
				(item) => item.uri === document.uri
			);

			if (existingIndex !== -1) {
				// Remove the existing entry to update its position
				recentDocuments.splice(existingIndex, 1);
			}

			// Add to the beginning of recent documents
			recentDocuments.unshift({
				...document,
				accessedAt: Date.now(),
			});

			// Limit to max number of recent documents
			if (recentDocuments.length > MAX_RECENT_DOCUMENTS) {
				recentDocuments = recentDocuments.slice(0, MAX_RECENT_DOCUMENTS);
			}

			// Save updated recent documents
			await AsyncStorage.setItem(
				RECENT_DOCUMENTS_STORAGE_KEY,
				JSON.stringify(recentDocuments)
			);

			return true;
		} catch (error) {
			console.error('Error adding to recent documents:', error);
			return false;
		}
	}

	/**
	 * Get all recent documents
	 * @returns {Promise<Array>} Array of recent documents
	 */
	async getRecentDocuments() {
		try {
			const recentJson = await AsyncStorage.getItem(
				RECENT_DOCUMENTS_STORAGE_KEY
			);
			return JSON.parse(recentJson) || [];
		} catch (error) {
			console.error('Error getting recent documents:', error);
			return [];
		}
	}

	/**
	 * Clear all recent documents
	 * @returns {Promise<boolean>} True if cleared successfully
	 */
	async clearRecentDocuments() {
		try {
			await AsyncStorage.setItem(
				RECENT_DOCUMENTS_STORAGE_KEY,
				JSON.stringify([])
			);
			return true;
		} catch (error) {
			console.error('Error clearing recent documents:', error);
			return false;
		}
	}

	/**
	 * Get documents by type
	 * @param {string} type - Document type/extension to filter
	 * @returns {Promise<Array>} Array of documents matching the type
	 */
	async getDocumentsByType(type) {
		try {
			// List all documents in the document directory
			const documents = await FileSystemService.listDocuments();

			// Filter by type
			return documents.filter((doc) => {
				if (type === 'folder') {
					return doc.isDirectory;
				}
				return doc.type === type;
			});
		} catch (error) {
			console.error('Error getting documents by type:', error);
			return [];
		}
	}

	/**
	 * Search documents by name
	 * @param {string} query - Search query
	 * @returns {Promise<Array>} Array of matching documents
	 */
	async searchDocuments(query) {
		try {
			if (!query || query.trim() === '') {
				return [];
			}

			// List all documents in the document directory
			const documents = await FileSystemService.listDocuments();

			// Filter by name (case-insensitive)
			const normalizedQuery = query.toLowerCase();
			return documents.filter((doc) =>
				doc.name.toLowerCase().includes(normalizedQuery)
			);
		} catch (error) {
			console.error('Error searching documents:', error);
			return [];
		}
	}

	/**
	 * Get all documents organized by type
	 * @returns {Promise<object>} Object with document types as keys and arrays as values
	 */
	async getAllDocumentsByType() {
		try {
			// List all documents in the document directory
			const allDocuments = await FileSystemService.listDocuments();

			// Organize by type
			const documentsByType = {};

			allDocuments.forEach((doc) => {
				const type = doc.isDirectory ? 'folders' : doc.type || 'unknown';

				if (!documentsByType[type]) {
					documentsByType[type] = [];
				}

				documentsByType[type].push(doc);
			});

			return documentsByType;
		} catch (error) {
			console.error('Error getting all documents by type:', error);
			return {};
		}
	}
}

export const DocumentService = new DocumentServiceClass();
