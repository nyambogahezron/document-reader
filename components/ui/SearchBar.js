import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const SearchBar = ({
  placeholder = 'Search documents',
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  onClearText,
  autoFocus = false,
  containerStyle,
  inputStyle,
  returnKeyType = 'search',
  inputProps = {},
  iconSize = 24,
}) => {
  const { colors, isDark } = useTheme();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation values
  const barWidth = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Show with animation when mounted
    Animated.parallel([
      Animated.timing(barWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    
    Animated.timing(barWidth, {
      toValue: 1.02,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (onFocus) {
      onFocus();
    }
  };
  
  // Handle blur events
  const handleBlur = () => {
    setIsFocused(false);
    
    Animated.timing(barWidth, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (onBlur) {
      onBlur();
    }
  };
  
  // Clear the text input
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.clear();
    }
    
    if (onChangeText) {
      onChangeText('');
    }
    
    if (onClearText) {
      onClearText();
    }
  };
  
  // Handle submission
  const handleSubmitEditing = (e) => {
    if (onSubmit) {
      onSubmit(e.nativeEvent.text);
    }
    
    Keyboard.dismiss();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceVariant : colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [{ scaleX: barWidth }],
          opacity: contentOpacity,
        },
        isFocused && {
          borderColor: colors.primary,
        },
        containerStyle,
      ]}
    >
      <MaterialIcons
        name="search"
        size={iconSize}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />
      
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: colors.text,
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmitEditing}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        returnKeyType={returnKeyType}
        clearButtonMode="while-editing"
        keyboardAppearance={isDark ? 'dark' : 'light'}
        autoFocus={autoFocus}
        selectionColor={colors.primary}
        {...inputProps}
      />
      
      {value && value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <MaterialIcons
            name="close"
            size={iconSize - 4}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 8,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;