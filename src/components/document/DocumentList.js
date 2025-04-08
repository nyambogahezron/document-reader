import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import DocumentItem from './DocumentItem';
import AnimatedCard from '../animations/AnimatedCard';
import SkeletonLoader from '../animations/SkeletonLoader';

const DocumentList = ({
  documents,
  onDocumentPress,
  onDocumentLongPress,
  onBookmarkPress,
  onSharePress,
  onMorePress,
  isLoading = false,
  isEmpty = false,
  error = null,
  refreshing = false,
  onRefresh = null,
  bookmarkedDocuments = [],
  emptyTitle = 'No Documents',
  emptyMessage = 'There are no documents to display',
  errorTitle = 'Error Loading Documents',
  errorMessage = 'There was a problem loading your documents. Pull down to retry.',
  showActions = true,
  gridView = false,
  containerStyle,
  headerComponent = null,
  footerComponent = null,
  numLoadingSkeletons = 5,
}) => {
  const { colors, isDark } = useTheme();
  
  // Function to check if a document is bookmarked
  const isDocumentBookmarked = (document) => {
    return bookmarkedDocuments.some(
      (bookmarked) => bookmarked.uri === document.uri
    );
  };
  
  // Render the loading state with skeleton loaders
  const renderLoading = () => {
    return (
      <View style={styles.centerContainer}>
        {Array.from({ length: numLoadingSkeletons }).map((_, index) => (
          <View
            key={`skeleton-${index}`}
            style={[
              styles.skeletonContainer,
              { borderBottomColor: colors.border },
            ]}
          >
            <SkeletonLoader.Circle size={48} />
            <View style={styles.skeletonContent}>
              <SkeletonLoader width="80%" height={18} />
              <View style={styles.skeletonDetails}>
                <SkeletonLoader width="40%" height={14} />
                <SkeletonLoader
                  width={40}
                  height={20}
                  style={styles.skeletonBadge}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  // Render the empty state
  const renderEmpty = () => {
    return (
      <AnimatedCard animationType="fade" duration={300} visible={true}>
        <View style={styles.centerContainer}>
          <MaterialIcons
            name="folder-open"
            size={64}
            color={colors.textTertiary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {emptyTitle}
          </Text>
          <Text
            style={[styles.emptyMessage, { color: colors.textSecondary }]}
          >
            {emptyMessage}
          </Text>
        </View>
      </AnimatedCard>
    );
  };
  
  // Render the error state
  const renderError = () => {
    return (
      <AnimatedCard animationType="fade" duration={300} visible={true}>
        <View style={styles.centerContainer}>
          <MaterialIcons
            name="error-outline"
            size={64}
            color={colors.error}
            style={styles.errorIcon}
          />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            {errorTitle}
          </Text>
          <Text
            style={[styles.errorMessage, { color: colors.textSecondary }]}
          >
            {errorMessage}
          </Text>
        </View>
      </AnimatedCard>
    );
  };
  
  // Render a document item
  const renderItem = ({ item, index }) => {
    return (
      <DocumentItem
        document={item}
        onPress={onDocumentPress}
        onLongPress={onDocumentLongPress}
        onBookmarkPress={onBookmarkPress}
        onSharePress={onSharePress}
        onMorePress={onMorePress}
        isBookmarked={isDocumentBookmarked(item)}
        showActions={showActions}
        animationDelay={100}
        gridView={gridView}
        index={index}
      />
    );
  };
  
  // Handle rendering different states
  if (isLoading) {
    return renderLoading();
  }
  
  if (error) {
    return (
      <FlatList
        data={[]}
        ListEmptyComponent={renderError}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          )
        }
      />
    );
  }
  
  if (isEmpty || (documents && documents.length === 0)) {
    return (
      <FlatList
        data={[]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          )
        }
      />
    );
  }
  
  // Render the document list
  return (
    <FlatList
      data={documents}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.uri || `document-${index}`}
      contentContainerStyle={[
        gridView ? styles.gridContainer : styles.listContainer,
        containerStyle,
      ]}
      numColumns={gridView ? 2 : 1}
      key={gridView ? 'grid' : 'list'}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      refreshControl={
        onRefresh && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  gridContainer: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    width: '100%',
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  skeletonDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  skeletonBadge: {
    marginLeft: 8,
    borderRadius: 4,
  },
});

export default DocumentList;