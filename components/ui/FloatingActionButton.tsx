import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Text,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { Colors } from '../../types';

interface ActionItem {
	icon: string;
	label?: string;
	onPress?: () => void;
	color?: string;
	iconColor?: string;
}

type Position =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'
	| 'center-right'
	| 'center-left';

interface FloatingActionButtonProps {
	mainIcon?: string;
	mainAction?: () => void;
	mainLabel?: string;
	actions?: ActionItem[];
	position?: Position;
	containerStyle?: ViewStyle;
	buttonStyle?: ViewStyle;
	actionButtonStyle?: ViewStyle;
	fabSize?: number;
	actionButtonSize?: number;
	iconSize?: number;
	actionIconSize?: number;
	spacing?: number;
	disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
	mainIcon = 'add',
	mainAction,
	mainLabel,
	actions = [],
	position = 'bottom-right',
	containerStyle,
	buttonStyle,
	actionButtonStyle,
	fabSize = 56,
	actionButtonSize = 48,
	iconSize = 24,
	actionIconSize = 20,
	spacing = 80,
	disabled = false,
}) => {
	const { colors, isDark } = useTheme();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Animation values
	const rotateAnim = useAnimatedValue(0);
	const scaleAnim = useAnimatedValue(1);
	const actionsAnim = useAnimatedValue(0);

	// Handle main button press
	const handleMainPress = () => {
		if (actions.length === 0) {
			// If no sub-actions, just execute the main action
			if (mainAction) {
				mainAction();
			}
			return;
		}

		// Toggle the menu
		setIsOpen(!isOpen);

		// Animate the main button rotation
		Animated.spring(rotateAnim, {
			toValue: isOpen ? 0 : 1,
			friction: 5,
			tension: 60,
			useNativeDriver: true,
		}).start();

		// Animate the actions appearance
		Animated.spring(actionsAnim, {
			toValue: isOpen ? 0 : 1,
			friction: 6,
			tension: 50,
			useNativeDriver: true,
		}).start();
	};

	// Handle action button press
	const handleActionPress = (action: ActionItem) => {
		setIsOpen(false);

		// Reset animations
		Animated.spring(rotateAnim, {
			toValue: 0,
			friction: 5,
			tension: 60,
			useNativeDriver: true,
		}).start();

		Animated.spring(actionsAnim, {
			toValue: 0,
			friction: 6,
			tension: 50,
			useNativeDriver: true,
		}).start();

		// Execute the action
		if (action.onPress) {
			action.onPress();
		}
	};

	// Interpolate rotation for main icon
	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '45deg'],
	});

	// Calculate position styles
	const getPositionStyles = () => {
		const styles = makeStyles(colors, fabSize, actionButtonSize);

		switch (position) {
			case 'bottom-right':
				return styles.bottomRight;
			case 'bottom-left':
				return styles.bottomLeft;
			case 'top-right':
				return styles.topRight;
			case 'top-left':
				return styles.topLeft;
			case 'center-right':
				return styles.centerRight;
			case 'center-left':
				return styles.centerLeft;
			default:
				return styles.bottomRight;
		}
	};

	// Render a single action button
	const renderActionButton = (action: ActionItem, index: number) => {
		// Calculate the animation values for this action
		const translateY = actionsAnim.interpolate({
			inputRange: [0, 1],
			outputRange: [0, -((index + 1) * spacing)],
		});

		const scale = actionsAnim.interpolate({
			inputRange: [0, 0.7, 1],
			outputRange: [0, 1.2, 1],
		});

		const opacity = actionsAnim.interpolate({
			inputRange: [0, 0.3, 1],
			outputRange: [0, 0, 1],
		});

		const styles = makeStyles(colors, fabSize, actionButtonSize);

		return (
			<Animated.View
				key={index}
				style={[
					styles.actionButtonContainer,
					{
						transform: [{ translateY }, { scale }],
						opacity,
					},
				]}
			>
				{/* Action label */}
				{action.label && (
					<Animated.View
						style={[
							styles.actionLabelContainer,
							{
								backgroundColor: isDark
									? colors.surfaceVariant
									: colors.surface,
								opacity,
								right: position.includes('left')
									? 'auto'
									: actionButtonSize + 12,
								left: position.includes('left')
									? actionButtonSize + 12
									: 'auto',
							},
						]}
					>
						<Text style={[styles.actionLabel, { color: colors.text }]}>
							{action.label}
						</Text>
					</Animated.View>
				)}

				{/* Action button */}
				<TouchableOpacity
					style={[
						styles.actionButton,
						{
							backgroundColor: action.color || colors.secondary,
							width: actionButtonSize,
							height: actionButtonSize,
							right: position.includes('left') ? 'auto' : 0,
							left: position.includes('left') ? 0 : 'auto',
						},
						actionButtonStyle,
					]}
					onPress={() => handleActionPress(action)}
					activeOpacity={0.8}
					disabled={disabled}
				>
					<MaterialIcons
						name={action.icon as any}
						size={actionIconSize}
						color={action.iconColor || 'white'}
					/>
				</TouchableOpacity>
			</Animated.View>
		);
	};

	const styles = makeStyles(colors, fabSize, actionButtonSize);

	return (
		<View
			style={[styles.container, getPositionStyles(), containerStyle]}
			pointerEvents='box-none'
		>
			{/* Action buttons */}
			{actions.map(renderActionButton)}

			{/* Main button */}
			<TouchableOpacity
				style={[
					styles.mainButton,
					{
						backgroundColor: colors.primary,
						width: fabSize,
						height: fabSize,
						right: position.includes('left') ? 'auto' : 0,
						left: position.includes('left') ? 0 : 'auto',
					},
					buttonStyle,
				]}
				onPress={handleMainPress}
				activeOpacity={0.8}
				disabled={disabled}
			>
				<Animated.View
					style={[
						styles.iconContainer,
						{
							transform: [{ rotate }],
						},
					]}
				>
					<MaterialIcons name={mainIcon as any} size={iconSize} color='white' />
				</Animated.View>
			</TouchableOpacity>

			{/* Main label (if any) */}
			{mainLabel && !isOpen && (
				<View
					style={[
						styles.mainLabelContainer,
						{
							backgroundColor: isDark ? colors.surfaceVariant : colors.surface,
							right: position.includes('left') ? 'auto' : fabSize + 16,
							left: position.includes('left') ? fabSize + 16 : 'auto',
						},
					]}
				>
					<Text style={[styles.mainLabel, { color: colors.text }]}>
						{mainLabel}
					</Text>
				</View>
			)}

			{/* Backdrop when menu is open */}
			{isOpen && (
				<TouchableOpacity
					style={styles.backdrop}
					activeOpacity={1}
					onPress={handleMainPress}
				/>
			)}
		</View>
	);
};

const makeStyles = (
	colors: Colors,
	fabSize: number,
	actionButtonSize: number
) =>
	StyleSheet.create({
		container: {
			position: 'absolute',
			zIndex: 999,
			alignItems: 'center',
		},
		bottomRight: {
			bottom: 20,
			right: 20,
		},
		bottomLeft: {
			bottom: 20,
			left: 20,
		},
		topRight: {
			top: 20,
			right: 20,
		},
		topLeft: {
			top: 20,
			left: 20,
		},
		centerRight: {
			top: '50%',
			right: 20,
			marginTop: -fabSize / 2,
		},
		centerLeft: {
			top: '50%',
			left: 20,
			marginTop: -fabSize / 2,
		},
		mainButton: {
			borderRadius: fabSize / 2,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 5,
			shadowColor: '#000',
			shadowOpacity: 0.3,
			shadowRadius: 4,
			shadowOffset: { width: 0, height: 2 },
			zIndex: 1,
		},
		iconContainer: {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
		actionButtonContainer: {
			position: 'absolute',
			bottom: 0,
			right: 0,
			flexDirection: 'row',
			alignItems: 'center',
		},
		actionButton: {
			borderRadius: actionButtonSize / 2,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 4,
			shadowColor: '#000',
			shadowOpacity: 0.3,
			shadowRadius: 3,
			shadowOffset: { width: 0, height: 2 },
			zIndex: 1,
		},
		actionLabelContainer: {
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 4,
			marginRight: 8,
			marginLeft: 8,
			elevation: 2,
			shadowColor: '#000',
			shadowOpacity: 0.2,
			shadowRadius: 2,
			shadowOffset: { width: 0, height: 1 },
		},
		actionLabel: {
			fontSize: 14,
			fontFamily: 'Inter_500Medium',
		},
		mainLabelContainer: {
			position: 'absolute',
			bottom: 16,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 4,
			elevation: 2,
			shadowColor: '#000',
			shadowOpacity: 0.2,
			shadowRadius: 2,
			shadowOffset: { width: 0, height: 1 },
		},
		mainLabel: {
			fontSize: 14,
			fontFamily: 'Inter_500Medium',
		},
		backdrop: {
			position: 'absolute',
			top: -1000,
			left: -1000,
			right: -1000,
			bottom: -1000,
			backgroundColor: 'transparent',
			zIndex: 0,
		},
	});

export default FloatingActionButton;
