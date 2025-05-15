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
import { getDocumentTypeIcon } from '../../constants/icons';

const CategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  style,
  horizontal = true,
  showAllOption = true,
  allCategoryLabel = 'All',
  iconSize = 20,
}) => {
  const { colors } = useTheme();

  // If there are no categories, don't render anything
  if (!categories || categories.length === 0) {
    return null;
  }

  // Render a single category item
  const renderCategoryItem = (category, index) => {
    const isSelected = selectedCategory === category.id;
    
    // Get the icon name for this category
    let iconName = category.icon;
    if (!iconName && category.type) {
      iconName = getDocumentTypeIcon(category.type);
    }

    return (
      <TouchableOpacity
        key={category.id || index}
        style={[
          styles.categoryItem,
          isSelected && [
            styles.selectedCategoryItem,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ],
          { borderColor: colors.border },
        ]}
        onPress={() => onSelectCategory(category.id)}
        activeOpacity={0.7}
      >
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={isSelected ? 'white' : colors.textSecondary}
            style={styles.categoryIcon}
          />
        )}
        <Text
          style={[
            styles.categoryText,
            isSelected
              ? { color: 'white' }
              : { color: colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {category.label || category.name}
        </Text>
        {category.count !== undefined && (
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isSelected
                  ? 'rgba(255, 255, 255, 0.3)'
                  : colors.surfaceVariant,
              },
            ]}
          >
            <Text
              style={[
                styles.countText,
                { color: isSelected ? 'white' : colors.textSecondary },
              ]}
            >
              {category.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
        style,
      ]}
    >
      {/* "All" category option */}
      {showAllOption && (
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === 'all' && [
              styles.selectedCategoryItem,
              { backgroundColor: colors.primary, borderColor: colors.primary },
            ],
            { borderColor: colors.border },
          ]}
          onPress={() => onSelectCategory('all')}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="apps"
            size={iconSize}
            color={selectedCategory === 'all' ? 'white' : colors.textSecondary}
            style={styles.categoryIcon}
          />
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'all'
                ? { color: 'white' }
                : { color: colors.textSecondary },
            ]}
          >
            {allCategoryLabel}
          </Text>
        </TouchableOpacity>
      )}

      {/* Map through categories */}
      {categories.map(renderCategoryItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  verticalContainer: {
    flexDirection: 'column',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedCategoryItem: {
    borderWidth: 1,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});

export default CategoryList;