import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { getFileExtension } from '../utils/fileFormatUtils';
import { DocumentInfo } from '../types';

const DOCUMENT_DIRECTORY = `${FileSystem.documentDirectory}documents/`;

/**
 * Service for handling file system operations for documents
 */
export class FileSystemService {
	/**
	 * Initialize the document directory structure
	 */
	static async initializeDocumentDirectory(): Promise<void> {
		try {
			const dirInfo = await FileSystem.getInfoAsync(DOCUMENT_DIRECTORY);

			if (!dirInfo.exists) {
				console.log('Creating document directory...');
				await FileSystem.makeDirectoryAsync(DOCUMENT_DIRECTORY, {
					intermediates: true,
				});
			}
		} catch (error) {
			console.error('Error initializing document directory:', error);
			throw error;
		}
	}

	/**
	 * Get all documents from the document directory
	 */
	static async getAllDocuments(): Promise<DocumentInfo[]> {
		try {
			await this.initializeDocumentDirectory();

			const dirInfo = await FileSystem.readDirectoryAsync(DOCUMENT_DIRECTORY);
			const documents: DocumentInfo[] = [];

			for (const fileName of dirInfo) {
				const filePath = `${DOCUMENT_DIRECTORY}${fileName}`;
				const fileInfo = await FileSystem.getInfoAsync(filePath);

				if (!fileInfo.isDirectory && fileInfo.exists) {
					const size = (fileInfo as any).size;
					const modificationTime = (fileInfo as any).modificationTime;

					documents.push({
						name: fileName,
						uri: filePath,
						type: getFileExtension(fileName),
						size: size ? this.formatFileSize(size) : 'Unknown',
						lastModified: modificationTime
							? new Date(modificationTime).toISOString()
							: new Date().toISOString(),
					});
				}
			}

			return documents;
		} catch (error) {
			console.error('Error getting all documents:', error);
			return [];
		}
	}

	/**
	 * Copy a document to the document directory
	 */
	static async copyDocumentToDirectory(
		sourceUri: string,
		fileName: string
	): Promise<string> {
		try {
			await this.initializeDocumentDirectory();

			const destinationUri = `${DOCUMENT_DIRECTORY}${fileName}`;
			await FileSystem.copyAsync({
				from: sourceUri,
				to: destinationUri,
			});

			return destinationUri;
		} catch (error) {
			console.error('Error copying document:', error);
			throw error;
		}
	}

	/**
	 * Delete a document
	 */
	static async deleteDocument(uri: string): Promise<void> {
		try {
			const fileInfo = await FileSystem.getInfoAsync(uri);

			if (fileInfo.exists) {
				await FileSystem.deleteAsync(uri);
			}
		} catch (error) {
			console.error('Error deleting document:', error);
			throw error;
		}
	}

	/**
	 * Get document information
	 */
	static async getDocumentInfo(uri: string): Promise<DocumentInfo | null> {
		try {
			const fileInfo = await FileSystem.getInfoAsync(uri);

			if (!fileInfo.exists) {
				return null;
			}

			const fileName = uri.split('/').pop() || 'Unknown';
			const size = (fileInfo as any).size;
			const modificationTime = (fileInfo as any).modificationTime;

			return {
				name: fileName,
				uri,
				type: getFileExtension(fileName),
				size: size ? this.formatFileSize(size) : 'Unknown',
				lastModified: modificationTime
					? new Date(modificationTime).toISOString()
					: new Date().toISOString(),
			};
		} catch (error) {
			console.error('Error getting document info:', error);
			return null;
		}
	}

	/**
	 * Check if a file exists
	 */
	static async fileExists(uri: string): Promise<boolean> {
		try {
			const fileInfo = await FileSystem.getInfoAsync(uri);
			return fileInfo.exists;
		} catch (error) {
			console.error('Error checking file existence:', error);
			return false;
		}
	}

	/**
	 * Get file size
	 */
	static async getFileSize(uri: string): Promise<number> {
		try {
			const fileInfo = await FileSystem.getInfoAsync(uri);
			if (fileInfo.exists && !fileInfo.isDirectory) {
				return (fileInfo as any).size || 0;
			}
			return 0;
		} catch (error) {
			console.error('Error getting file size:', error);
			return 0;
		}
	}

	/**
	 * Format file size to human readable format
	 */
	static formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	/**
	 * Share a document
	 */
	static async shareDocument(uri: string, mimeType?: string): Promise<void> {
		try {
			const isAvailable = await Sharing.isAvailableAsync();

			if (!isAvailable) {
				throw new Error('Sharing is not available on this platform');
			}

			await Sharing.shareAsync(uri, {
				mimeType: mimeType || 'application/octet-stream',
			});
		} catch (error) {
			console.error('Error sharing document:', error);
			throw error;
		}
	}

	/**
	 * Save document to device downloads/gallery
	 */
	static async saveToDevice(uri: string, albumName?: string): Promise<void> {
		try {
			const { status } = await MediaLibrary.requestPermissionsAsync();

			if (status !== 'granted') {
				throw new Error('Media library permission not granted');
			}

			const asset = await MediaLibrary.createAssetAsync(uri);

			if (albumName) {
				const album = await MediaLibrary.getAlbumAsync(albumName);
				if (album) {
					await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
				} else {
					await MediaLibrary.createAlbumAsync(albumName, asset, false);
				}
			}
		} catch (error) {
			console.error('Error saving to device:', error);
			throw error;
		}
	}

	/**
	 * Get documents by type
	 */
	static async getDocumentsByType(type: string): Promise<DocumentInfo[]> {
		try {
			const allDocuments = await this.getAllDocuments();
			return allDocuments.filter(
				(doc) => doc.type.toLowerCase() === type.toLowerCase()
			);
		} catch (error) {
			console.error('Error getting documents by type:', error);
			return [];
		}
	}

	/**
	 * Search documents by name
	 */
	static async searchDocuments(query: string): Promise<DocumentInfo[]> {
		try {
			const allDocuments = await this.getAllDocuments();
			const searchTerm = query.toLowerCase();

			return allDocuments.filter(
				(doc) =>
					doc.name.toLowerCase().includes(searchTerm) ||
					doc.type.toLowerCase().includes(searchTerm)
			);
		} catch (error) {
			console.error('Error searching documents:', error);
			return [];
		}
	}

	/**
	 * List documents in a specific directory
	 */
	static async listDocuments(directoryPath: string): Promise<DocumentInfo[]> {
		try {
			const dirInfo = await FileSystem.getInfoAsync(directoryPath);

			if (!dirInfo.exists || !dirInfo.isDirectory) {
				return [];
			}

			const files = await FileSystem.readDirectoryAsync(directoryPath);
			const documents: DocumentInfo[] = [];

			for (const fileName of files) {
				const filePath = `${directoryPath}/${fileName}`;
				const fileInfo = await FileSystem.getInfoAsync(filePath);

				if (!fileInfo.isDirectory && fileInfo.exists) {
					const size = (fileInfo as any).size;
					const modificationTime = (fileInfo as any).modificationTime;

					documents.push({
						name: fileName,
						uri: filePath,
						type: getFileExtension(fileName),
						size: size ? this.formatFileSize(size) : 'Unknown',
						lastModified: modificationTime
							? new Date(modificationTime).toISOString()
							: new Date().toISOString(),
					});
				}
			}

			return documents;
		} catch (error) {
			console.error('Error listing documents:', error);
			return [];
		}
	}
}
