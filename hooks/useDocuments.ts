import { useState, useEffect, useCallback } from 'react';
import { DocumentService } from '../services/DocumentService';
import { FileSystemService } from '../services/FileSystemService';

/**
 * A hook that provides access to documents with various filtering and sorting options
 */
export const useDocuments = (options = {}) => {
  // Destructure options with defaults
  const {
    type = null,
    path = null,
    searchQuery = '',
    sortBy = 'name',
    sortDirection = 'asc',
    limit = 0,
    refreshOnMount = true,
    includeBookmarks = false,
    includeRecent = false,
  } = options;
  
  // State variables
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedDocuments, setBookmarkedDocuments] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  
  // Function to load documents
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let docs = [];
      
      // Load from specific path if provided
      if (path) {
        docs = await FileSystemService.listDocuments(path);
      } 
      // Load documents by type if specified
      else if (type) {
        docs = await DocumentService.getDocumentsByType(type);
      } 
      // Search for documents if query provided
      else if (searchQuery) {
        docs = await DocumentService.searchDocuments(searchQuery);
      } 
      // Get all documents organized by type
      else {
        const docsByType = await DocumentService.getAllDocumentsByType();
        docs = Object.values(docsByType).flat();
      }
      
      // Apply sorting
      docs = sortDocuments(docs, sortBy, sortDirection);
      
      // Apply limit if specified
      if (limit > 0 && docs.length > limit) {
        docs = docs.slice(0, limit);
      }
      
      setDocuments(docs);
      
      // Load bookmarks if requested
      if (includeBookmarks) {
        const bookmarks = await DocumentService.getBookmarks();
        setBookmarkedDocuments(bookmarks);
      }
      
      // Load recent documents if requested
      if (includeRecent) {
        const recentDocs = await DocumentService.getRecentDocuments();
        setRecentDocuments(recentDocs);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [path, type, searchQuery, sortBy, sortDirection, limit, includeBookmarks, includeRecent]);
  
  // Sort documents based on the provided criteria
  const sortDocuments = (docs, sortKey, direction) => {
    return [...docs].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];
      
      // Handle special cases
      if (sortKey === 'modifiedAt' || sortKey === 'createdAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (sortKey === 'size') {
        aValue = Number(aValue || 0);
        bValue = Number(bValue || 0);
      } else {
        // Default string comparison
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };
  
  // Handle document bookmark toggle
  const toggleBookmark = async (document) => {
    try {
      const isBookmarked = await DocumentService.isDocumentBookmarked(document.uri);
      
      if (isBookmarked) {
        await DocumentService.removeBookmark(document.uri);
        setBookmarkedDocuments(prev => 
          prev.filter(doc => doc.uri !== document.uri)
        );
      } else {
        await DocumentService.addBookmark(document.uri, document.name, document.type);
        setBookmarkedDocuments(prev => [...prev, document]);
      }
      
      return !isBookmarked;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      throw err;
    }
  };
  
  // Add a document to recent list
  const addToRecent = async (document) => {
    try {
      await DocumentService.addToRecentDocuments(document);
      
      // Update recent documents if we're tracking them
      if (includeRecent) {
        const recentDocs = await DocumentService.getRecentDocuments();
        setRecentDocuments(recentDocs);
      }
    } catch (err) {
      console.error('Error adding document to recent:', err);
    }
  };
  
  // Clear recent documents
  const clearRecentDocuments = async () => {
    try {
      await DocumentService.clearRecentDocuments();
      setRecentDocuments([]);
    } catch (err) {
      console.error('Error clearing recent documents:', err);
      throw err;
    }
  };
  
  // Delete a document
  const deleteDocument = async (uri) => {
    try {
      await FileSystemService.deleteDocument(uri);
      
      // Update documents list
      setDocuments(prev => prev.filter(doc => doc.uri !== uri));
      
      // Update bookmarks if needed
      if (includeBookmarks) {
        setBookmarkedDocuments(prev => 
          prev.filter(doc => doc.uri !== uri)
        );
      }
      
      // Update recent documents if needed
      if (includeRecent) {
        setRecentDocuments(prev => 
          prev.filter(doc => doc.uri !== uri)
        );
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };
  
  // Load documents when dependencies change
  useEffect(() => {
    if (refreshOnMount) {
      loadDocuments();
    }
  }, [loadDocuments, refreshOnMount]);
  
  return {
    documents,
    bookmarkedDocuments,
    recentDocuments,
    isLoading,
    error,
    refreshDocuments: loadDocuments,
    toggleBookmark,
    addToRecent,
    clearRecentDocuments,
    deleteDocument,
    isDocumentBookmarked: (uri) => 
      bookmarkedDocuments.some(doc => doc.uri === uri),
  };
};