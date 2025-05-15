import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { formatFileSize, formatDate, getDocumentTypeName } from '../../utils/fileFormatUtils';
import { getDocumentTypeIcon } from '../../constants/icons';
import { ANIMATION_PRESETS } from '../../utils/animationUtils';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import AnimatedButton from '../animations/AnimatedButton';

const DocumentItem = ({
  document,
  onPress,
  onLongPress,
  onBookmarkPress,
  onSharePress,
  onMorePress,
  isBookmarked = false,
  showActions = true,
  animationDelay = 0,
  gridView = false,
  index = 0,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  
  // Animation values
  const opacity = useAnimatedValue(0);
  const translateY = useAnimatedValue(20);
  
  // Start animation immediately
  React.useEffect(() => {
    const delay = animationDelay + (index * 50);
    
    // Animate opacity and position
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        ANIMATION_PRESETS.fadeIn(opacity),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);
  
  // Handle pressing the document item
  const handlePress = () => {
    if (onPress) {
      onPress(document);
    }
  };
  
  // Handle long pressing the document item
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(document);
    } else {
      setIsActionsVisible(!isActionsVisible);
    }
  };
  
  // Handle bookmarking the document
  const handleBookmarkPress = () => {
    if (onBookmarkPress) {
      onBookmarkPress(document);
    }
  };
  
  // Handle sharing the document
  const handleSharePress = () => {
    if (onSharePress) {
      onSharePress(document);
    }
  };
  
  // Handle pressing the more options button
  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress(document);
    }
  };
  
  // Create icon component based on document type
  const renderDocumentIcon = () => {
    const iconName = getDocumentTypeIcon(document.type);
    
    return (
      <View 
        style={[
          styles.iconContainer,
          gridView ? styles.gridIconContainer : {},
          {
            backgroundColor: isDark ? colors.surfaceVariant : '#F8FAFC',
          },
        ]}
      >
        <MaterialIcons
          name={iconName}
          size={gridView ? 32 : 24}
          color={colors.primary}
        />
      </View>
    );
  };
  
  // File type badge
  const renderTypeBadge = () => {
    return (
      <View 
        style={[
          styles.typeBadge,
          {
            backgroundColor: isDark ? colors.surfaceVariant : '#F0F4FF',
          },
        ]}
      >
        <Text 
          style={[
            styles.typeBadgeText,
            { color: colors.primary },
          ]}
        >
          {document.type?.toUpperCase() || 'UNKNOWN'}
        </Text>
      </View>
    );
  };
  
  // Document details (grid view)
  const renderGridItem = () => {
    return (
      <Animated.View
        style={[
          styles.gridContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={styles.gridItemInner}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
        >
          {renderDocumentIcon()}
          
          <View style={styles.gridContentContainer}>
            <Text
              style={[styles.titleGrid, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {document.name}
            </Text>
            
            <Text
              style={[styles.detailsGrid, { color: colors.textTertiary }]}
              numberOfLines={1}
            >
              {formatFileSize(document.size)}
            </Text>
          </View>
          
          {document.type && renderTypeBadge()}
          
          {/* Bookmark button */}
          {showActions && (
            <TouchableOpacity
              style={styles.gridBookmarkButton}
              onPress={handleBookmarkPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Document details (list view)
  const renderListItem = () => {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            borderBottomColor: colors.border,
            opacity,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={styles.itemInner}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
        >
          {renderDocumentIcon()}
          
          <View style={styles.contentContainer}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {document.name}
            </Text>
            
            <View style={styles.detailsContainer}>
              <Text
                style={[styles.details, { color: colors.textTertiary }]}
                numberOfLines={1}
              >
                {formatFileSize(document.size)}
                {document.modifiedAt && ` • ${formatDate(document.modifiedAt)}`}
              </Text>
              
              {document.type && renderTypeBadge()}
            </View>
          </View>
          
          {/* Action buttons */}
          {showActions && (
            <View style={styles.actionsContainer}>
              <AnimatedButton onPress={handleBookmarkPress}>
                <MaterialIcons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isBookmarked ? colors.primary : colors.textTertiary}
                />
              </AnimatedButton>
              
              <AnimatedButton onPress={handleSharePress}>
                <MaterialIcons
                  name="share"
                  size={22}
                  color={colors.textTertiary}
                />
              </AnimatedButton>
              
              <AnimatedButton onPress={handleMorePress}>
                <MaterialIcons
                  name="more-vert"
                  size={22}
                  color={colors.textTertiary}
                />
              </AnimatedButton>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return gridView ? renderGridItem() : renderListItem();
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gridIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  details: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginRight: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 8,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  gridContainer: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    margin: '1%',
  },
  gridItemInner: {
    alignItems: 'center',
  },
  gridContentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  titleGrid: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailsGrid: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  gridBookmarkButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
});

export default DocumentItem;