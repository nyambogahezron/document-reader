import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  findNodeHandle,
  Platform,
} from 'react-native';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

/**
 * A wrapper component that provides shared element transition capabilities
 * for smoother navigation between screens. This component can be used to create
 * the illusion that elements are shared across screens.
 * 
 * @param {object} props - Component props
 * @param {string} props.id - Unique identifier for the shared element
 * @param {boolean} props.isActive - If true, this is the active instance of the shared element
 * @param {boolean} props.shouldAnimate - If true, the element should animate
 * @param {Function} props.onAnimationComplete - Callback when animation completes
 * @param {number} props.startX - Starting X position for appearing animation
 * @param {number} props.startY - Starting Y position for appearing animation
 * @param {number} props.startWidth - Starting width for appearing animation
 * @param {number} props.startHeight - Starting height for appearing animation
 * @param {object} props.style - Additional styles for the wrapper
 * @param {React.ReactNode} props.children - Child components
 */
const SharedElementWrapper = ({
  id,
  isActive = false,
  shouldAnimate = false,
  onAnimationComplete,
  startX,
  startY,
  startWidth,
  startHeight,
  style,
  children,
}) => {
  // Refs for calculating element layout
  const viewRef = useRef(null);
  const [measurements, setMeasurements] = useState(null);
  
  // Animation values
  const translateX = useAnimatedValue(0);
  const translateY = useAnimatedValue(0);
  const scaleX = useAnimatedValue(1);
  const scaleY = useAnimatedValue(1);
  const opacity = useAnimatedValue(isActive ? 0 : 1);
  
  // Store if we've played the animation already
  const animationStarted = useRef(false);
  
  // When the component mounts, measure the element position
  useEffect(() => {
    if (viewRef.current) {
      measureElement().then(measures => {
        setMeasurements(measures);
      });
    }
  }, []);
  
  // When isActive changes and we have measurements, animate
  useEffect(() => {
    if (isActive && measurements && shouldAnimate && startX !== undefined && startY !== undefined) {
      if (!animationStarted.current) {
        animationStarted.current = true;
        
        // Set initial position
        translateX.setValue(startX - measurements.x);
        translateY.setValue(startY - measurements.y);
        
        if (startWidth && startHeight) {
          scaleX.setValue(startWidth / measurements.width);
          scaleY.setValue(startHeight / measurements.height);
        }
        
        // Animate to final position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(scaleX, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(scaleY, {
            toValue: 1,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Animation is complete, call the callback
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        });
      }
    }
  }, [isActive, measurements, shouldAnimate, startX, startY]);
  
  /**
   * Measures the element and returns its position and dimensions
   * @returns {Promise<object>} Object with position and dimensions
   */
  const measureElement = () => {
    return new Promise(resolve => {
      if (!viewRef.current) {
        resolve(null);
        return;
      }
      
      const nodeHandle = findNodeHandle(viewRef.current);
      if (!nodeHandle) {
        resolve(null);
        return;
      }
      
      // Measure the component position
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        resolve({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    });
  };
  
  /**
   * Animate the element to the given target measures
   * @param {object} targetMeasures - Target position and dimensions
   * @param {Function} onComplete - Callback when animation completes
   */
  const animateTo = (targetMeasures, onComplete) => {
    if (!measurements) return;
    
    // Calculate the difference
    const xDiff = targetMeasures.x - measurements.x;
    const yDiff = targetMeasures.y - measurements.y;
    const widthRatio = targetMeasures.width / measurements.width;
    const heightRatio = targetMeasures.height / measurements.height;
    
    // Set initial values
    translateX.setValue(0);
    translateY.setValue(0);
    scaleX.setValue(1);
    scaleY.setValue(1);
    
    // Animate to target
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: xDiff,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: yDiff,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleX, {
        toValue: widthRatio,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleY, {
        toValue: heightRatio,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  };
  
  return (
    <Animated.View
      ref={viewRef}
      style={[
        styles.container,
        style,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scaleX },
            { scaleY },
          ],
        },
      ]}
      onLayout={() => {
        // Re-measure on layout change
        measureElement().then(measures => {
          setMeasurements(measures);
        });
      }}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No styling by default to avoid interfering with child dimensions
  },
});

export default SharedElementWrapper;