import { Animated, Easing } from 'react-native';

export const DURATIONS = {
	shortest: 150,
	shorter: 200,
	short: 250,
	standard: 300,
	complex: 375,
	medium: 400,
	long: 500,
} as const;

export const EASINGS = {
	linear: Easing.linear,
	ease: Easing.ease,
	easeIn: Easing.in(Easing.ease),
	easeOut: Easing.out(Easing.ease),
	easeInOut: Easing.inOut(Easing.ease),
	elastic: Easing.elastic(1),
	bounce: Easing.bounce,
	circ: Easing.circle,
	cubic: Easing.cubic,
	quad: Easing.quad,
	sin: Easing.sin,
} as const;

export const SPRING_CONFIGS = {
	default: {
		tension: 40,
		friction: 7,
		useNativeDriver: true,
	},
	gentle: {
		tension: 40,
		friction: 10,
		useNativeDriver: true,
	},
	wobbly: {
		tension: 180,
		friction: 12,
		useNativeDriver: true,
	},
	stiff: {
		tension: 100,
		friction: 5,
		useNativeDriver: true,
	},
	slow: {
		tension: 280,
		friction: 60,
		useNativeDriver: true,
	},
} as const;

export const ANIMATION_PRESETS = {
	fadeIn: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 1,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	fadeOut: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeIn,
			useNativeDriver: true,
		});
	},

	scaleIn: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.spring(animatedValue, {
			toValue: 1,
			...SPRING_CONFIGS.default,
		});
	},

	scaleOut: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeIn,
			useNativeDriver: true,
		});
	},

	slideInLeft: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	slideInRight: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	slideInTop: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	slideInBottom: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	slideInUp: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	popIn: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 1,
			duration,
			easing: EASINGS.easeOut,
			useNativeDriver: true,
		});
	},

	popOut: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.standard
	) => {
		return Animated.timing(animatedValue, {
			toValue: 0,
			duration,
			easing: EASINGS.easeIn,
			useNativeDriver: true,
		});
	},

	bounce: (animatedValue: Animated.Value) => {
		return Animated.sequence([
			Animated.timing(animatedValue, {
				toValue: 1.2,
				duration: DURATIONS.shorter,
				easing: EASINGS.easeOut,
				useNativeDriver: true,
			}),
			Animated.timing(animatedValue, {
				toValue: 1,
				duration: DURATIONS.shorter,
				easing: EASINGS.easeIn,
				useNativeDriver: true,
			}),
		]);
	},

	pulse: (animatedValue: Animated.Value) => {
		return Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1.1,
					duration: DURATIONS.standard,
					easing: EASINGS.easeInOut,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: DURATIONS.standard,
					easing: EASINGS.easeInOut,
					useNativeDriver: true,
				}),
			])
		);
	},

	shake: (animatedValue: Animated.Value) => {
		return Animated.sequence([
			Animated.timing(animatedValue, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(animatedValue, {
				toValue: -10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(animatedValue, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(animatedValue, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}),
		]);
	},

	rotate: (
		animatedValue: Animated.Value,
		duration: number = DURATIONS.long
	) => {
		return Animated.loop(
			Animated.timing(animatedValue, {
				toValue: 1,
				duration,
				easing: EASINGS.linear,
				useNativeDriver: true,
			})
		);
	},
} as const;

export const AnimationHelpers = {
	sequence: (animations: Animated.CompositeAnimation[]) => {
		return Animated.sequence(animations);
	},

	parallel: (animations: Animated.CompositeAnimation[]) => {
		return Animated.parallel(animations);
	},

	stagger: (delay: number, animations: Animated.CompositeAnimation[]) => {
		return Animated.stagger(delay, animations);
	},

	delay: (duration: number) => {
		return Animated.delay(duration);
	},

	interpolate: (
		animatedValue: Animated.Value,
		inputRange: number[],
		outputRange: number[] | string[]
	) => {
		return animatedValue.interpolate({
			inputRange,
			outputRange,
			extrapolate: 'clamp',
		});
	},
};

export const TransformAnimations = {
	scale: (animatedValue: Animated.Value) => ({
		transform: [{ scale: animatedValue }],
	}),

	translateX: (animatedValue: Animated.Value) => ({
		transform: [{ translateX: animatedValue }],
	}),

	translateY: (animatedValue: Animated.Value) => ({
		transform: [{ translateY: animatedValue }],
	}),

	rotate: (animatedValue: Animated.Value) => ({
		transform: [
			{
				rotate: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: ['0deg', '360deg'],
				}),
			},
		],
	}),

	rotateZ: (
		animatedValue: Animated.Value,
		inputRange: number[] = [0, 1],
		outputRange: string[] = ['0deg', '360deg']
	) => ({
		transform: [
			{
				rotateZ: animatedValue.interpolate({
					inputRange,
					outputRange,
				}),
			},
		],
	}),

	scaleAndFade: (scaleValue: Animated.Value, fadeValue: Animated.Value) => ({
		opacity: fadeValue,
		transform: [{ scale: scaleValue }],
	}),
} as const;
