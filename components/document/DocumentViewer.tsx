import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ActivityIndicator,
	Alert,
	ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../hooks/useTheme';
import { getFileExtension, getMimeType } from '../../utils/fileFormatUtils';

const { width, height } = Dimensions.get('window');

interface DocumentViewerProps {
	uri: string;
	fileName: string;
	onLoadStart?: () => void;
	onLoadEnd?: () => void;
	onError?: (error: any) => void;
	onPageChanged?: (page: number, totalPages: number) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
	uri,
	fileName,
	onLoadStart,
	onLoadEnd,
	onError,
	onPageChanged,
}) => {
	const { colors } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [fileContent, setFileContent] = useState<string>('');

	const fileExtension = getFileExtension(fileName);
	const mimeType = getMimeType(fileExtension);

	useEffect(() => {
		loadDocument();
	}, [uri]);

	const loadDocument = async () => {
		try {
			setIsLoading(true);
			setError(null);
			onLoadStart?.();

			// For text files, read content directly
			if (
				['txt', 'md', 'json', 'xml', 'html', 'htm', 'css', 'js', 'ts'].includes(
					fileExtension
				)
			) {
				const content = await FileSystem.readAsStringAsync(uri);
				setFileContent(content);
			}

			setIsLoading(false);
			onLoadEnd?.();
		} catch (err) {
			console.error('Error loading document:', err);
			setError('Failed to load document');
			setIsLoading(false);
			onError?.(err);
		}
	};

	const handlePdfLoadComplete = (numberOfPages: number, filePath: string) => {
		setIsLoading(false);
		onLoadEnd?.();
		onPageChanged?.(1, numberOfPages);
	};

	const handlePdfPageChanged = (page: number, numberOfPages: number) => {
		onPageChanged?.(page, numberOfPages);
	};

	const handlePdfError = (error: any) => {
		console.error('PDF Error:', error);
		setError('Failed to load PDF');
		setIsLoading(false);
		onError?.(error);
	};

	const handleWebViewError = (syntheticEvent: any) => {
		const { nativeEvent } = syntheticEvent;
		console.error('WebView Error:', nativeEvent);
		setError('Failed to load document');
		setIsLoading(false);
		onError?.(nativeEvent);
	};

	const renderPdfViewer = () => (
		<Pdf
			source={{ uri }}
			style={styles.pdf}
			onLoadComplete={handlePdfLoadComplete}
			onPageChanged={handlePdfPageChanged}
			onError={handlePdfError}
			onLoadProgress={(percent) => {
				// Handle load progress if needed
			}}
			spacing={0}
			enablePaging={true}
			horizontal={false}
			scale={1.0}
		/>
	);

	const renderTextViewer = () => (
		<ScrollView
			style={[styles.textContainer, { backgroundColor: colors.surface }]}
		>
			<Text style={[styles.textContent, { color: colors.text }]}>
				{fileContent}
			</Text>
		</ScrollView>
	);

	const renderWebViewer = () => (
		<WebView
			source={{ uri }}
			style={styles.webview}
			onError={handleWebViewError}
			onLoadStart={() => {
				setIsLoading(true);
				onLoadStart?.();
			}}
			onLoadEnd={() => {
				setIsLoading(false);
				onLoadEnd?.();
			}}
			startInLoadingState={true}
			renderLoading={() => (
				<View
					style={[
						styles.loadingContainer,
						{ backgroundColor: colors.background },
					]}
				>
					<ActivityIndicator size='large' color={colors.primary} />
					<Text style={[styles.loadingText, { color: colors.text }]}>
						Loading document...
					</Text>
				</View>
			)}
		/>
	);

	const renderUnsupportedViewer = () => (
		<View
			style={[styles.unsupportedContainer, { backgroundColor: colors.surface }]}
		>
			<Text style={[styles.unsupportedText, { color: colors.text }]}>
				This file type is not supported for preview.
			</Text>
			<Text
				style={[styles.unsupportedSubtext, { color: colors.textSecondary }]}
			>
				File: {fileName}
			</Text>
			<Text
				style={[styles.unsupportedSubtext, { color: colors.textSecondary }]}
			>
				Type: {fileExtension.toUpperCase()}
			</Text>
		</View>
	);

	const renderViewer = () => {
		if (error) {
			return (
				<View
					style={[styles.errorContainer, { backgroundColor: colors.surface }]}
				>
					<Text style={[styles.errorText, { color: colors.error }]}>
						{error}
					</Text>
				</View>
			);
		}

		switch (fileExtension) {
			case 'pdf':
				return renderPdfViewer();
			case 'txt':
			case 'md':
			case 'json':
			case 'xml':
				return renderTextViewer();
			case 'html':
			case 'htm':
				return renderWebViewer();
			default:
				return renderUnsupportedViewer();
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			{isLoading && (
				<View
					style={[
						styles.loadingContainer,
						{ backgroundColor: colors.background },
					]}
				>
					<ActivityIndicator size='large' color={colors.primary} />
					<Text style={[styles.loadingText, { color: colors.text }]}>
						Loading document...
					</Text>
				</View>
			)}
			{renderViewer()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pdf: {
		flex: 1,
		width,
		height,
	},
	webview: {
		flex: 1,
	},
	textContainer: {
		flex: 1,
		padding: 16,
	},
	textContent: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: 'monospace',
	},
	loadingContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
	},
	unsupportedContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	unsupportedText: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 16,
	},
	unsupportedSubtext: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 8,
	},
});

export default DocumentViewer;
