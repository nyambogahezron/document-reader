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
export const useAnimatedValue = (
	initialValue: number = 0,
	cleanupFn: ((value: Animated.Value) => void) | null = null
) => {
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
 * A hook that creates multiple animated values with the same initial value
 *
 * @param {number} count - Number of animated values to create
 * @param {number} initialValue - The initial value for all animations
 * @returns {Animated.Value[]} An array of animated value references
 */
export const useMultipleAnimatedValues = (
	count: number,
	initialValue: number = 0
) => {
	const animatedValues = useRef(
		Array.from({ length: count }, () => new Animated.Value(initialValue))
	).current;

	useEffect(() => {
		return () => {
			// Stop all animations when the component unmounts
			animatedValues.forEach((value: Animated.Value) => value.stopAnimation());
		};
	}, []);

	return animatedValues;
};

/**
 * A hook that creates animated values from an array of initial values
 *
 * @param {number[]} initialValues - Array of initial values
 * @returns {Animated.Value[]} An array of animated value references
 */
export const useAnimatedValueArray = (initialValues: number[]) => {
	const animatedValues = useRef(
		initialValues.map((value: number) => new Animated.Value(value))
	).current;

	useEffect(() => {
		return () => {
			// Stop all animations when the component unmounts
			animatedValues.forEach((value: Animated.Value) => value.stopAnimation());
		};
	}, []);

	return animatedValues;
};
