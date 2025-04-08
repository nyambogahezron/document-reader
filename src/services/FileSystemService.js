import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { getFileExtension, getMimeType } from '../utils/fileFormatUtils';

// Document directory path - where we'll store all documents
const DOCUMENT_DIRECTORY = `${FileSystem.documentDirectory}documents/`;

/**
 * Service for handling file system operations for documents
 */
class FileSystemServiceClass {
  constructor() {
    this.initializeDocumentDirectory();
  }
  
  /**
   * Initialize the document directory structure
   */
  async initializeDocumentDirectory() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(DOCUMENT_DIRECTORY);
      
      if (!dirInfo.exists) {
        console.log('Creating document directory...');
        await FileSystem.makeDirectoryAsync(DOCUMENT_DIRECTORY, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing document directory:', error);
    }
  }
  
  /**
   * Get the document directory path
   * @returns {string} The path to the document directory
   */
  getDocumentDirectoryPath() {
    return DOCUMENT_DIRECTORY;
  }
  
  /**
   * List all documents in a directory
   * @param {string} path - Directory path to list (defaults to document directory)
   * @returns {Promise<Array>} Array of document objects with fileInfo and metadata
   */
  async listDocuments(path = DOCUMENT_DIRECTORY) {
    try {
      const dirExists = await FileSystem.getInfoAsync(path);
      
      if (!dirExists.exists) {
        await FileSystem.makeDirectoryAsync(path, { intermediates: true });
        return [];
      }
      
      const files = await FileSystem.readDirectoryAsync(path);
      
      // Get detailed info for each file
      const filePromises = files.map(async (filename) => {
        const fileUri = `${path}${filename}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
        const isDirectory = fileInfo.isDirectory;
        
        let metadata = {
          name: filename,
          uri: fileUri,
          type: isDirectory ? 'folder' : getFileExtension(filename),
          size: fileInfo.size || 0,
          modifiedAt: fileInfo.modificationTime || Date.now(),
          isDirectory,
        };
        
        return { ...fileInfo, ...metadata };
      });
      
      return Promise.all(filePromises);
    } catch (error) {
      console.error('Error listing documents:', error);
      return [];
    }
  }
  
  /**
   * Create a new directory
   * @param {string} dirName - Name of the directory to create
   * @param {string} parentPath - Parent directory path
   * @returns {Promise<string>} Path to the created directory
   */
  async createDirectory(dirName, parentPath = DOCUMENT_DIRECTORY) {
    try {
      const dirPath = `${parentPath}${dirName}/`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      }
      
      return dirPath;
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }
  
  /**
   * Save a file to the document directory
   * @param {string} uri - URI of the file to save
   * @param {string} filename - Name to give the saved file
   * @param {string} destinationPath - Directory to save to
   * @returns {Promise<string>} URI of the saved file
   */
  async saveFile(uri, filename, destinationPath = DOCUMENT_DIRECTORY) {
    try {
      // Ensure destination path exists
      const dirInfo = await FileSystem.getInfoAsync(destinationPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(destinationPath, { intermediates: true });
      }
      
      // Generate destination URI
      const destUri = `${destinationPath}${filename}`;
      
      // Check if file already exists
      const fileInfo = await FileSystem.getInfoAsync(destUri);
      if (fileInfo.exists) {
        // File already exists, handle conflict (e.g., rename)
        const extension = getFileExtension(filename);
        const nameWithoutExt = filename.slice(0, filename.length - extension.length - 1);
        const timestamp = new Date().getTime();
        const newFilename = `${nameWithoutExt}_${timestamp}.${extension}`;
        return this.saveFile(uri, newFilename, destinationPath);
      }
      
      // Copy or download the file
      if (uri.startsWith('file://') || uri.startsWith('content://')) {
        await FileSystem.copyAsync({ from: uri, to: destUri });
      } else {
        // Download from remote URL
        const downloadResult = await FileSystem.downloadAsync(uri, destUri);
        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download file: ${downloadResult.status}`);
        }
      }
      
      return destUri;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }
  
  /**
   * Delete a document from storage
   * @param {string} uri - URI of the document to delete
   * @returns {Promise<boolean>} True if successful
   */
  async deleteDocument(uri) {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }
  
  /**
   * Move a document to a new location
   * @param {string} sourceUri - Source URI of the document
   * @param {string} destinationPath - Destination directory path
   * @returns {Promise<string>} New URI of the document
   */
  async moveDocument(sourceUri, destinationPath) {
    try {
      const filename = sourceUri.split('/').pop();
      const destinationUri = `${destinationPath}${filename}`;
      
      // Check if destination exists
      const destInfo = await FileSystem.getInfoAsync(destinationPath);
      if (!destInfo.exists) {
        await FileSystem.makeDirectoryAsync(destinationPath, { intermediates: true });
      }
      
      // Check if destination file already exists
      const destFileInfo = await FileSystem.getInfoAsync(destinationUri);
      if (destFileInfo.exists) {
        // Handle conflict by renaming
        const ext = getFileExtension(filename);
        const nameWithoutExt = filename.slice(0, filename.length - ext.length - 1);
        const timestamp = new Date().getTime();
        const newFilename = `${nameWithoutExt}_${timestamp}.${ext}`;
        const newDestUri = `${destinationPath}${newFilename}`;
        
        await FileSystem.moveAsync({ from: sourceUri, to: newDestUri });
        return newDestUri;
      } else {
        await FileSystem.moveAsync({ from: sourceUri, to: destinationUri });
        return destinationUri;
      }
    } catch (error) {
      console.error('Error moving document:', error);
      throw error;
    }
  }
  
  /**
   * Copy a document to a new location
   * @param {string} sourceUri - Source URI of the document
   * @param {string} destinationPath - Destination directory path
   * @returns {Promise<string>} URI of the copied document
   */
  async copyDocument(sourceUri, destinationPath) {
    try {
      const filename = sourceUri.split('/').pop();
      const destinationUri = `${destinationPath}${filename}`;
      
      // Check if destination exists
      const destInfo = await FileSystem.getInfoAsync(destinationPath);
      if (!destInfo.exists) {
        await FileSystem.makeDirectoryAsync(destinationPath, { intermediates: true });
      }
      
      // Check if destination file already exists
      const destFileInfo = await FileSystem.getInfoAsync(destinationUri);
      if (destFileInfo.exists) {
        // Handle conflict by renaming
        const ext = getFileExtension(filename);
        const nameWithoutExt = filename.slice(0, filename.length - ext.length - 1);
        const timestamp = new Date().getTime();
        const newFilename = `${nameWithoutExt}_${timestamp}.${ext}`;
        const newDestUri = `${destinationPath}${newFilename}`;
        
        await FileSystem.copyAsync({ from: sourceUri, to: newDestUri });
        return newDestUri;
      } else {
        await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
        return destinationUri;
      }
    } catch (error) {
      console.error('Error copying document:', error);
      throw error;
    }
  }
  
  /**
   * Rename a document
   * @param {string} uri - URI of the document to rename
   * @param {string} newName - New name for the document
   * @returns {Promise<string>} New URI of the document
   */
  async renameDocument(uri, newName) {
    try {
      const dirPath = uri.substring(0, uri.lastIndexOf('/') + 1);
      const newUri = `${dirPath}${newName}`;
      
      // Check if destination exists
      const destInfo = await FileSystem.getInfoAsync(newUri);
      if (destInfo.exists) {
        throw new Error('A file with this name already exists');
      }
      
      await FileSystem.moveAsync({ from: uri, to: newUri });
      return newUri;
    } catch (error) {
      console.error('Error renaming document:', error);
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
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      const filename = uri.split('/').pop();
      const extension = getFileExtension(filename);
      
      return {
        name: filename,
        uri: fileInfo.uri,
        size: fileInfo.size || 0,
        type: extension,
        isDirectory: fileInfo.isDirectory || false,
        modifiedAt: fileInfo.modificationTime || Date.now(),
        mimeType: getMimeType(extension),
      };
    } catch (error) {
      console.error('Error getting document info:', error);
      throw error;
    }
  }
  
  /**
   * Share a document with other apps
   * @param {string} uri - URI of the document to share
   * @returns {Promise<boolean>} True if shared successfully
   */
  async shareDocument(uri) {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Sharing is not available on this device');
      }
      
      await Sharing.shareAsync(uri);
      return true;
    } catch (error) {
      console.error('Error sharing document:', error);
      return false;
    }
  }
  
  /**
   * Save a document to the device's media library
   * @param {string} uri - URI of the document to save
   * @returns {Promise<boolean>} True if saved successfully
   */
  async saveToMediaLibrary(uri) {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Media library permission not granted');
      }
      
      // Create asset from file
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Save to default album
      const album = await MediaLibrary.getAlbumAsync('Documents');
      if (album === null) {
        await MediaLibrary.createAlbumAsync('Documents', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving to media library:', error);
      return false;
    }
  }
  
  /**
   * Read content of a text file
   * @param {string} uri - URI of the text file
   * @returns {Promise<string>} Content of the file
   */
  async readTextFile(uri) {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    } catch (error) {
      console.error('Error reading text file:', error);
      throw error;
    }
  }
  
  /**
   * Get the size of the cache directory
   * @returns {Promise<number>} Size in bytes
   */
  async getCacheSize() {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      const dirInfo = await FileSystem.getInfoAsync(cacheDir, { size: true });
      return dirInfo.size || 0;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }
  
  /**
   * Clear the cache directory
   * @returns {Promise<boolean>} True if cleared successfully
   */
  async clearCache() {
    try {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
}

export const FileSystemService = new FileSystemServiceClass();