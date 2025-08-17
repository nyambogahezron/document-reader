import React, { useEffect, ReactNode } from 'react';
import {
	View,
	StyleSheet,
	Animated,
	ViewStyle,
	DimensionValue,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

interface SkeletonBaseProps {
	width?: DimensionValue;
	height?: number;
	style?: ViewStyle | ViewStyle[];
	borderRadius?: number;
	shimmerStyle?: ViewStyle;
	shimmerWidth?: number;
	shimmerDuration?: number;
	showShimmer?: boolean;
	backgroundColor?: string;
	shimmerColor?: string;
	children?: ReactNode;
}

// Skeleton base component
const SkeletonBase: React.FC<SkeletonBaseProps> = ({
	width = '100%',
	height = 15,
	style,
	borderRadius = 4,
	shimmerStyle,
	shimmerWidth = 100,
	shimmerDuration = 1200,
	showShimmer = true,
	backgroundColor,
	shimmerColor,
	children,
}) => {
	const { colors, isDark } = useTheme();

	// Animation values
	const shimmerPosition = useAnimatedValue(-shimmerWidth);

	// Default colors if not provided
	const bgColor = backgroundColor || (isDark ? '#333333' : '#E5E5E5');
	const shimColor = shimmerColor || (isDark ? '#444444' : '#F5F5F5');

	useEffect(() => {
		// If shimmer is enabled, start the animation
		if (showShimmer) {
			startShimmerAnimation();
		}
	}, [showShimmer]);

	// Start the shimmer animation
	const startShimmerAnimation = () => {
		Animated.loop(
			Animated.timing(shimmerPosition, {
				toValue: shimmerWidth * 2,
				duration: shimmerDuration,
				useNativeDriver: false,
			})
		).start();
	};

	// Render the shimmer effect
	const renderShimmer = () => {
		if (!showShimmer) return null;

		return (
			<Animated.View
				style={[
					styles.shimmer,
					{
						width: shimmerWidth,
						backgroundColor: shimColor,
						left: shimmerPosition,
					},
					shimmerStyle,
				]}
			/>
		);
	};

	return (
		<View
			style={[
				styles.skeleton,
				{
					width,
					height,
					borderRadius,
					backgroundColor: bgColor,
				},
				style,
			]}
		>
			{renderShimmer()}
			{children}
		</View>
	);
};

interface CircleProps extends Omit<SkeletonBaseProps, 'width' | 'height'> {
	size?: number;
}

// Circle skeleton
const Circle: React.FC<CircleProps> = ({ size = 40, style, ...props }) => {
	return (
		<SkeletonBase
			width={size}
			height={size}
			borderRadius={size / 2}
			style={{
				aspectRatio: 1,
				...(Array.isArray(style) ? Object.assign({}, ...style) : style || {}),
			}}
			{...props}
		/>
	);
};

interface RectangleProps extends SkeletonBaseProps {}

// Rectangle skeleton
const Rectangle: React.FC<RectangleProps> = ({
	width = '100%',
	height = 15,
	style,
	borderRadius = 4,
	...props
}) => {
	return (
		<SkeletonBase
			width={width}
			height={height}
			borderRadius={borderRadius}
			style={style}
			{...props}
		/>
	);
};

interface CardProps extends SkeletonBaseProps {}

// Card skeleton
const Card: React.FC<CardProps> = ({
	width = '100%',
	height = 100,
	style,
	borderRadius = 8,
	...props
}) => {
	return (
		<SkeletonBase
			width={width}
			height={height}
			borderRadius={borderRadius}
			style={{
				...styles.card,
				...(Array.isArray(style) ? Object.assign({}, ...style) : style || {}),
			}}
			{...props}
		/>
	);
};

interface AvatarProps extends Omit<SkeletonBaseProps, 'width' | 'height'> {
	size?: number;
}

// Avatar skeleton
const Avatar: React.FC<AvatarProps> = ({ size = 50, style, ...props }) => {
	return (
		<Circle
			size={size}
			style={{
				...styles.avatar,
				...(Array.isArray(style) ? Object.assign({}, ...style) : style || {}),
			}}
			{...props}
		/>
	);
};

interface HeaderProps extends SkeletonBaseProps {}

// Header skeleton
const Header: React.FC<HeaderProps> = ({
	width = '70%',
	height = 24,
	style,
	...props
}) => {
	return (
		<SkeletonBase
			width={width}
			height={height}
			style={{
				...styles.header,
				...(Array.isArray(style) ? Object.assign({}, ...style) : style || {}),
			}}
			{...props}
		/>
	);
};

interface ParagraphProps extends Omit<SkeletonBaseProps, 'width' | 'height'> {
	lines?: number;
	lineHeight?: number;
	lineSpacing?: number;
	lineWidths?: number[];
}

// Paragraph skeleton
const Paragraph: React.FC<ParagraphProps> = ({
	lines = 3,
	lineHeight = 15,
	lineSpacing = 10,
	style,
	lineWidths = [90, 100, 70],
	...props
}) => {
	return (
		<View style={[styles.paragraph, style]}>
			{Array.from({ length: lines }).map((_, index) => {
				// Calculate width for each line
				const width = `${
					lineWidths[index % lineWidths.length]
				}%` as DimensionValue;

				return (
					<SkeletonBase
						key={index}
						width={width}
						height={lineHeight}
						style={{ marginBottom: index < lines - 1 ? lineSpacing : 0 }}
						{...props}
					/>
				);
			})}
		</View>
	);
};

// Combine all components
const SkeletonLoader = Object.assign(SkeletonBase, {
	Circle,
	Rectangle,
	Card,
	Avatar,
	Header,
	Paragraph,
});

const styles = StyleSheet.create({
	skeleton: {
		overflow: 'hidden',
		position: 'relative',
	},
	shimmer: {
		position: 'absolute',
		top: 0,
		height: '100%',
		elevation: 1,
		zIndex: 1,
		opacity: 0.6,
	},
	card: {
		elevation: 2,
	},
	avatar: {
		marginVertical: 5,
	},
	header: {
		marginBottom: 12,
	},
	paragraph: {
		width: '100%',
	},
});

export default SkeletonLoader;
