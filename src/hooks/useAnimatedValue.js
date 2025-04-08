import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * A hook that creates and manages an animated value that can be initialized with a starting value
 * and optionally have a cleanup function when the component unmounts.
 * 
 * @param {number} initialValue - The initial value for the animation
 * @param {function} cleanupFn - Optional function to run when the component unmounts
 * @returns {object} The animated value reference
 */
export const useAnimatedValue = (initialValue = 0, cleanupFn = null) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  
  useEffect(() => {
    return () => {
      // Call the cleanup function when the component unmounts
      if (cleanupFn) {
        cleanupFn(animatedValue);
      }
      
      // Stop any ongoing animations
      animatedValue.stopAnimation();
    };
  }, []);
  
  return animatedValue;
};

/**
 * Creates multiple animated values at once with the same initial value
 * 
 * @param {number} count - Number of animated values to create
 * @param {number} initialValue - The initial value for all animations
 * @returns {array} Array of animated values
 */
export const useMultipleAnimatedValues = (count, initialValue = 0) => {
  const animatedValues = useRef(
    Array(count)
      .fill(0)
      .map(() => new Animated.Value(initialValue))
  ).current;
  
  useEffect(() => {
    return () => {
      // Stop all animations when the component unmounts
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, []);
  
  return animatedValues;
};

/**
 * Creates multiple animated values with different initial values
 * 
 * @param {array} initialValues - Array of initial values
 * @returns {array} Array of animated values
 */
export const useAnimatedValueArray = (initialValues) => {
  const animatedValues = useRef(
    initialValues.map((value) => new Animated.Value(value))
  ).current;
  
  useEffect(() => {
    return () => {
      // Stop all animations when the component unmounts
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, []);
  
  return animatedValues;
};