import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { MaterialIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SNAP_POINTS = {
  CLOSED: 0,
  HALF: SCREEN_HEIGHT * 0.5,
  FULL: SCREEN_HEIGHT * 0.9,
};

const BottomSheet = ({
  isVisible,
  onClose,
  title,
  children,
  snapPoints,
  initialSnapPoint = 'HALF',
  showDragHandle = true,
  showCloseButton = true,
  allowBackdropPress = true,
  enableHeaderDrag = true,
  customHeader,
  closeButtonPosition = 'right',
  closeButtonColor,
  style,
  contentContainerStyle,
  headerStyle,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  onSnapPointChange,
  modal = true,
  zIndex = 1000,
}) => {
  const { colors, isDark } = useTheme();
  
  // Calculate the snap points based on provided options
  const calculatedSnapPoints = snapPoints || SNAP_POINTS;
  
  // Get the initial snap point value
  const initialPosition = calculatedSnapPoints[initialSnapPoint] || calculatedSnapPoints.HALF;
  
  // Animation values
  const translateY = useAnimatedValue(SCREEN_HEIGHT);
  const backdropOpacity = useAnimatedValue(0);
  
  // Track the current snap point
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  
  // Ref for tracking the current position
  const currentPosition = useRef(initialPosition);
  
  // Define the pan responder for dragging the sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical movements
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        // When the user starts dragging, capture the current position
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down or up from where the sheet is
        if (gestureState.dy < 0) {
          // Dragging up - don't let it go higher than the max snap point
          const nextValue = Math.max(
            gestureState.dy,
            -SCREEN_HEIGHT + 50 // Leave a small gap at the top
          );
          translateY.setValue(nextValue);
        } else {
          // Dragging down - don't let it go higher than the max snap point
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        
        // Calculate the next snap point based on velocity and position
        const currentValue = currentPosition.current - gestureState.dy;
        let nextSnapPoint = 'CLOSED';
        
        // Sort snap points in descending order
        const sortedSnapPoints = Object.entries(calculatedSnapPoints)
          .sort((a, b) => b[1] - a[1]);
        
        // Determine which snap point to go to based on velocity and current position
        if (gestureState.vy < -0.5) {
          // Fast upward swipe - go to the highest snap point greater than current position
          for (const [key, value] of sortedSnapPoints) {
            if (value > currentValue) {
              nextSnapPoint = key;
              break;
            }
          }
        } else if (gestureState.vy > 0.5) {
          // Fast downward swipe - go to the lowest snap point smaller than current position
          const reversedPoints = [...sortedSnapPoints].reverse();
          for (const [key, value] of reversedPoints) {
            if (value < currentValue) {
              nextSnapPoint = key;
              break;
            }
          }
        } else {
          // Normal movement - go to the closest snap point
          let minDistance = Infinity;
          for (const [key, value] of Object.entries(calculatedSnapPoints)) {
            const distance = Math.abs(value - currentValue);
            if (distance < minDistance) {
              minDistance = distance;
              nextSnapPoint = key;
            }
          }
        }
        
        // If the next snap point is CLOSED, call onClose
        if (nextSnapPoint === 'CLOSED') {
          if (onClose) {
            onClose();
          }
        } else {
          // Animate to the next snap point
          snapToPoint(nextSnapPoint);
        }
      },
    })
  ).current;
  
  // Helper function to snap to a specific point
  const snapToPoint = (snapPoint) => {
    const toValue = calculatedSnapPoints[snapPoint] || 0;
    
    // Animate to the target position
    Animated.spring(translateY, {
      toValue: -toValue,
      tension: 65,
      friction: 10,
      useNativeDriver: true,
    }).start();
    
    // Update the current position and snap point
    currentPosition.current = toValue;
    setCurrentSnapPoint(snapPoint);
    
    // Call the callback if provided
    if (onSnapPointChange) {
      onSnapPointChange(snapPoint);
    }
  };
  
  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      // Show the bottom sheet when it becomes visible
      // Animate backdrop opacity
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Animate sheet position
      Animated.spring(translateY, {
        toValue: -initialPosition,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }).start();
      
      // Update current position
      currentPosition.current = initialPosition;
    } else {
      // Hide the bottom sheet when it becomes invisible
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, initialPosition]);
  
  // Handle backdrop press
  const handleBackdropPress = () => {
    if (allowBackdropPress && onClose) {
      onClose();
    }
  };
  
  // Handle close button press
  const handleClosePress = () => {
    if (onClose) {
      onClose();
    }
  };
  
  if (!isVisible && !modal) {
    return null;
  }
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: backdropOpacity,
          zIndex,
          display: 'flex',
          backgroundColor: backdropColor,
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            transform: [{ translateY }],
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              },
              android: {
                elevation: 16,
              },
            }),
          },
          style,
        ]}
      >
        {/* Drag handle and header */}
        {showDragHandle && !customHeader && (
          <View
            {...(enableHeaderDrag ? panResponder.panHandlers : {})}
            style={[
              styles.header,
              headerStyle,
            ]}
          >
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
            </View>
            
            {title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            )}
            
            {showCloseButton && (
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  closeButtonPosition === 'left' && styles.closeButtonLeft,
                ]}
                onPress={handleClosePress}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={closeButtonColor || colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Custom header if provided */}
        {customHeader && (
          <View
            {...(enableHeaderDrag ? panResponder.panHandlers : {})}
            style={styles.customHeaderContainer}
          >
            {customHeader}
          </View>
        )}
        
        {/* Content */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  dragHandleContainer: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  closeButtonLeft: {
    right: 'auto',
    left: 16,
  },
  contentContainer: {
    flex: 1,
  },
  customHeaderContainer: {
    width: '100%',
  },
});

export default BottomSheet;