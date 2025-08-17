import React, { useState, ReactNode } from 'react';
import {
	TouchableOpacity,
	Animated,
	StyleSheet,
	ViewStyle,
	Insets,
} from 'react-native';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

interface AnimatedButtonProps {
	children: ReactNode;
	onPress?: () => void;
	style?: ViewStyle;
	containerStyle?: ViewStyle;
	activeOpacity?: number;
	disabled?: boolean;
	scaleTo?: number;
	duration?: number;
	hitSlop?: Insets;
	useTouchableWithoutFeedback?: boolean;
	pressInSound?: any;
	pressOutSound?: any;
	feedbackEnabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
	children,
	onPress,
	style,
	containerStyle,
	activeOpacity = 0.7,
	disabled = false,
	scaleTo = 0.92,
	duration = 150,
	hitSlop,
	useTouchableWithoutFeedback = false,
	pressInSound = null,
	pressOutSound = null,
	feedbackEnabled = true,
}) => {
	const [isPressed, setIsPressed] = useState<boolean>(false);

	// Animation value for scale
	const scale = useAnimatedValue(1);

	// Handle touch events to create the press animation
	const handlePressIn = () => {
		setIsPressed(true);

		// Animate the scale down
		Animated.timing(scale, {
			toValue: scaleTo,
			duration: duration,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		setIsPressed(false);

		// Animate the scale back to normal
		Animated.timing(scale, {
			toValue: 1,
			duration: duration,
			useNativeDriver: true,
		}).start();
	};

	const handlePress = () => {
		if (onPress && !disabled) {
			onPress();
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			activeOpacity={activeOpacity}
			disabled={disabled}
			hitSlop={hitSlop}
			style={containerStyle}
		>
			<Animated.View
				style={[
					styles.container,
					{
						transform: [{ scale }],
					},
					style,
				]}
			>
				{children}
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
});

export default AnimatedButton;
