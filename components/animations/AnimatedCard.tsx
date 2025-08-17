import React, { useEffect, ReactNode } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

type AnimationType = 'scale' | 'scale-fade' | 'slide' | 'slide-fade' | 'fade';

interface AnimatedCardProps {
	children: ReactNode;
	animationType?: AnimationType;
	duration?: number;
	delay?: number;
	style?: ViewStyle;
	visible?: boolean;
	onAnimationStart?: () => void;
	onAnimationEnd?: () => void;
	useNativeDriver?: boolean;
	animationConfig?: object;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
	children,
	animationType = 'scale',
	duration = 300,
	delay = 0,
	style,
	visible = true,
	onAnimationStart,
	onAnimationEnd,
	useNativeDriver = true,
	animationConfig = {},
}) => {
	// Create animation values
	const opacity = useAnimatedValue(visible ? 0 : 1);
	const scale = useAnimatedValue(visible ? 0.9 : 1);
	const translateY = useAnimatedValue(visible ? 30 : 0);

	useEffect(() => {
		// Only animate if the visible prop changes
		animateCard(visible);
	}, [visible]);

	const animateCard = (toVisible: boolean) => {
		if (onAnimationStart) {
			onAnimationStart();
		}

		// Set animation config
		const config = {
			duration,
			useNativeDriver,
			...animationConfig,
		};

		// Define animations based on type
		const animations: Animated.CompositeAnimation[] = [];

		// Always include opacity animation
		animations.push(
			Animated.timing(opacity, {
				toValue: toVisible ? 1 : 0,
				...config,
			})
		);

		// Add specific animations based on type
		if (animationType === 'scale' || animationType === 'scale-fade') {
			animations.push(
				Animated.timing(scale, {
					toValue: toVisible ? 1 : 0.9,
					...config,
				})
			);
		}

		if (animationType === 'slide' || animationType === 'slide-fade') {
			animations.push(
				Animated.timing(translateY, {
					toValue: toVisible ? 0 : 30,
					...config,
				})
			);
		}

		// Start animations with delay if specified
		Animated.sequence([
			Animated.delay(delay),
			Animated.parallel(animations),
		]).start((finished) => {
			if (finished.finished && onAnimationEnd) {
				onAnimationEnd();
			}
		});
	};

	// Define animation style based on type
	const getAnimationStyle = (): Animated.AnimatedProps<ViewStyle> => {
		const animationStyle: any = { opacity };

		if (animationType === 'scale' || animationType === 'scale-fade') {
			animationStyle.transform = [{ scale }];
		} else if (animationType === 'slide' || animationType === 'slide-fade') {
			animationStyle.transform = [{ translateY }];
		} else if (animationType === 'fade') {
			// Only opacity, which is always included
		}

		return animationStyle;
	};

	// If not visible and opacity is 0, don't render anything
	if (!visible && (opacity as any)._value === 0) {
		return null;
	}

	return (
		<Animated.View style={[styles.container, getAnimationStyle(), style]}>
			{children}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
});

export default AnimatedCard;
