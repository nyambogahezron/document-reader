import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Keyboard,
	Platform,
	TextInputProps,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../types';

interface SearchBarProps {
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	onSubmit: (text: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	onClearText?: () => void;
	autoFocus?: boolean;
	containerStyle?: ViewStyle;
	inputStyle?: TextStyle;
	returnKeyType?: TextInputProps['returnKeyType'];
	inputProps?: Partial<TextInputProps>;
	iconSize?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
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
	const inputRef = useRef<TextInput>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);

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

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [autoFocus]);

	const handleFocus = () => {
		setIsFocused(true);
		onFocus?.();

		Animated.timing(barWidth, {
			toValue: 1.02,
			duration: 150,
			useNativeDriver: false,
		}).start();
	};

	const handleBlur = () => {
		setIsFocused(false);
		onBlur?.();

		Animated.timing(barWidth, {
			toValue: 1,
			duration: 150,
			useNativeDriver: false,
		}).start();
	};

	const handleSubmit = () => {
		onSubmit(value);
		Keyboard.dismiss();
	};

	const handleClear = () => {
		onChangeText('');
		onClearText?.();
		inputRef.current?.focus();
	};

	const styles = makeStyles(colors, isFocused);

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ scaleX: barWidth }],
					opacity: contentOpacity,
				},
				containerStyle,
			]}
		>
			<View style={styles.searchContainer}>
				<MaterialIcons
					name='search'
					size={iconSize}
					color={isFocused ? colors.primary : colors.textSecondary}
					style={styles.searchIcon}
				/>

				<TextInput
					ref={inputRef}
					style={[styles.input, inputStyle]}
					placeholder={placeholder}
					placeholderTextColor={colors.textTertiary}
					value={value}
					onChangeText={onChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onSubmitEditing={handleSubmit}
					returnKeyType={returnKeyType}
					selectionColor={colors.primary}
					underlineColorAndroid='transparent'
					autoCorrect={false}
					autoCapitalize='none'
					{...inputProps}
				/>

				{value.length > 0 && (
					<TouchableOpacity
						style={styles.clearButton}
						onPress={handleClear}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<MaterialIcons
							name='clear'
							size={iconSize - 2}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				)}
			</View>
		</Animated.View>
	);
};

const makeStyles = (colors: Colors, isFocused: boolean) =>
	StyleSheet.create({
		container: {
			marginHorizontal: 16,
			marginVertical: 8,
		},
		searchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.surface,
			borderRadius: 12,
			paddingHorizontal: 16,
			paddingVertical: Platform.OS === 'ios' ? 12 : 8,
			borderWidth: 1,
			borderColor: isFocused ? colors.primary : colors.border,
			shadowColor: colors.shadow,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		searchIcon: {
			marginRight: 12,
		},
		input: {
			flex: 1,
			fontSize: 16,
			fontFamily: 'Inter_400Regular',
			color: colors.text,
			paddingVertical: 0,
			includeFontPadding: false,
			textAlignVertical: 'center',
		},
		clearButton: {
			marginLeft: 8,
			padding: 4,
		},
	});

export default SearchBar;
