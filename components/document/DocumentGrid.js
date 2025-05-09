import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import DocumentItem from './DocumentItem';
import DocumentList from './DocumentList';

const DocumentGrid = ({
  documents,
  title,
  onViewAll,
  onDocumentPress,
  onDocumentLongPress,
  onBookmarkPress,
  onSharePress,
  onMorePress,
  bookmarkedDocuments = [],
  isLoading = false,
  isEmpty = false,
  error = null,
  emptyTitle = 'No Documents',
  emptyMessage = 'There are no documents to display',
  errorTitle = 'Error Loading Documents',
  errorMessage = 'There was a problem loading your documents',
  maxDisplayItems = 6,
  showActions = true,
  containerStyle,
  style,
}) => {
  const { colors, isDark } = useTheme();
  
  // Limit the number of displayed documents
  const displayDocuments = documents?.slice(0, maxDisplayItems) || [];
  const hasMoreDocuments = documents?.length > maxDisplayItems;

  // Render the header with title and optional "View All" button
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        
        {hasMoreDocuments && onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            style={styles.viewAllButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // If loading, empty, or error, render appropriate state
  if (isLoading || isEmpty || error || displayDocuments.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? colors.surfaceVariant : colors.background,
            borderColor: colors.border,
          },
          containerStyle,
        ]}
      >
        {renderHeader()}
        
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          isEmpty={isEmpty || (documents && documents.length === 0)}
          error={error}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          errorTitle={errorTitle}
          errorMessage={errorMessage}
          gridView={true}
          showActions={false}
          numLoadingSkeletons={4}
          containerStyle={[styles.gridContainer, style]}
        />
      </View>
    );
  }
  
  // Render the grid of documents
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceVariant : colors.background,
          borderColor: colors.border,
        },
        containerStyle,
      ]}
    >
      {renderHeader()}
      
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.gridContainer, style]}
      >
        <View style={styles.gridRow}>
          {displayDocuments.map((document, index) => (
            <DocumentItem
              key={document.uri || index}
              document={document}
              onPress={onDocumentPress}
              onLongPress={onDocumentLongPress}
              onBookmarkPress={onBookmarkPress}
              isBookmarked={bookmarkedDocuments.some(
                (bookmarked) => bookmarked.uri === document.uri
              )}
              showActions={showActions}
              gridView={true}
              index={index}
              animationDelay={50 * index}
              style={styles.gridItem}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginRight: 2,
  },
  gridContainer: {
    padding: 8,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 12,
  },
});

export default DocumentGrid;