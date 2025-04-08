import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	ActivityIndicator,
	Text,
	Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../hooks/useTheme';
import { getFileExtension } from '../../utils/fileFormatUtils';
import SkeletonLoader from '../animations/SkeletonLoader';
import AnimatedCard from '../animations/AnimatedCard';
import { MaterialIcons } from '@expo/vector-icons';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const DocumentViewer = ({
	uri,
	documentType,
	onLoadComplete,
	onError,
	style,
	pageMargin = 10,
	showPageIndicator = true,
	enablePinchGesture = true,
	enableDoubleTapZoom = true,
	enableAnnotationRendering = true,
	horizontalSwipe = false,
	password,
	cacheEnabled = true,
	textContent,
}) => {
	const { colors, isDark } = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	// References
	const pdfRef = useRef(null);
	const webViewRef = useRef(null);

	// Determine document type from URI if not provided
	const type = documentType || getFileExtension(uri).toLowerCase();

	// Different viewer components based on document type
	const renderPdfViewer = () => {
		const pdfHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=4.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
              background-color: ${isDark ? '#121212' : '#FFFFFF'};
            }
            #pdf-viewer {
              width: 100%;
              height: 100%;
              display: block;
              border: none;
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js"></script>
        </head>
        <body>
          <iframe id="pdf-viewer" src="${uri}" frameborder="0"></iframe>
        </body>
      </html>
    `;

		return (
			<AnimatedCard visible={!isLoading} style={styles.documentContainer}>
				<WebView
					ref={webViewRef}
					style={[styles.webviewContainer, style]}
					source={{ html: pdfHtml }}
					onLoad={() => {
						setIsLoading(false);
						if (onLoadComplete) {
							onLoadComplete({
								pageCount: 1,
								filePath: uri,
								dimensions: { width: WIDTH, height: HEIGHT },
							});
						}
					}}
					onError={(error) => {
						setError(error);
						setIsLoading(false);
						if (onError) {
							onError(error);
						}
					}}
				/>
			</AnimatedCard>
		);
	};

	// Generate CSS for text viewer
	const generateTextViewerHTML = (text) => {
		// Escape the text for HTML display
		const escapedText = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;')
			.replace(/\n/g, '<br />');

		const textColor = isDark ? '#FFFFFF' : '#000000';
		const backgroundColor = isDark ? '#121212' : '#FFFFFF';

		return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=10.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              padding: 16px;
              color: ${textColor};
              background-color: ${backgroundColor};
              font-size: 16px;
              margin: 0;
              word-wrap: break-word;
            }
            pre {
              white-space: pre-wrap;
              font-family: monospace;
              background-color: ${isDark ? '#1E1E1E' : '#F1F1F1'};
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <pre>${escapedText}</pre>
        </body>
      </html>
    `;
	};

	// Generate HTML for office document viewer
	const generateOfficeViewerHTML = (uri) => {
		// For Office documents, we use Office Online viewer or Google Docs viewer
		const encodedUri = encodeURIComponent(uri);

		// Use Microsoft's Office Online viewer as default
		// Fallback to Google Docs viewer if Microsoft's viewer isn't available
		return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodedUri}" width="100%" height="100%" frameborder="0">
            This is an embedded document, powered by Microsoft Office Online.
          </iframe>
        </body>
      </html>
    `;
	};

	// Text viewer for plain text files
	const renderTextViewer = () => {
		useEffect(() => {
			// Simulate loading time for text viewer
			const timer = setTimeout(() => {
				setIsLoading(false);
				if (onLoadComplete) {
					onLoadComplete({
						pageCount: 1,
						filePath: uri,
						dimensions: { width: WIDTH, height: HEIGHT },
					});
				}
			}, 500);

			return () => clearTimeout(timer);
		}, []);

		// If text content is provided, use it directly
		// Otherwise, the content should be fetched outside this component
		return (
			<AnimatedCard visible={!isLoading} style={styles.documentContainer}>
				<WebView
					ref={webViewRef}
					style={[styles.webviewContainer, style]}
					originWhitelist={['*']}
					source={{
						html: generateTextViewerHTML(textContent || 'Loading content...'),
					}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					showsVerticalScrollIndicator={true}
					bounces={true}
					scalesPageToFit={Platform.OS === 'android'}
					onError={(error) => {
						setError(error);
						setIsLoading(false);
						if (onError) {
							onError(error);
						}
					}}
					onLoadEnd={() => {
						setIsLoading(false);
					}}
				/>
			</AnimatedCard>
		);
	};

	// Office document viewer (docx, xlsx, pptx)
	const renderOfficeViewer = () => {
		return (
			<AnimatedCard visible={!isLoading} style={styles.documentContainer}>
				<WebView
					ref={webViewRef}
					style={[styles.webviewContainer, style]}
					source={{ html: generateOfficeViewerHTML(uri) }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={true}
					renderLoading={() => null}
					onLoadStart={() => {
						setIsLoading(true);
					}}
					onLoadEnd={() => {
						setIsLoading(false);
						if (onLoadComplete) {
							onLoadComplete({
								pageCount: 1,
								filePath: uri,
								dimensions: { width: WIDTH, height: HEIGHT },
							});
						}
					}}
					onError={(error) => {
						setError(error);
						setIsLoading(false);
						if (onError) {
							onError(error);
						}
					}}
				/>
			</AnimatedCard>
		);
	};

	// Image viewer
	const renderImageViewer = () => {
		// For images, we can just use a WebView with a simple HTML wrapper
		const imageHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: ${isDark ? '#121212' : '#FFFFFF'};
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${uri}" />
        </body>
      </html>
    `;

		useEffect(() => {
			const timer = setTimeout(() => {
				setIsLoading(false);
				if (onLoadComplete) {
					onLoadComplete({
						pageCount: 1,
						filePath: uri,
						dimensions: { width: WIDTH, height: HEIGHT },
					});
				}
			}, 500);

			return () => clearTimeout(timer);
		}, []);

		return (
			<AnimatedCard visible={!isLoading} style={styles.documentContainer}>
				<WebView
					ref={webViewRef}
					style={[styles.webviewContainer, style]}
					source={{ html: imageHtml }}
					javaScriptEnabled={false}
					scalesPageToFit={Platform.OS === 'android'}
					onError={(error) => {
						setError(error);
						setIsLoading(false);
						if (onError) {
							onError(error);
						}
					}}
				/>
			</AnimatedCard>
		);
	};

	// Error state
	const renderError = () => {
		return (
			<View
				style={[styles.errorContainer, { backgroundColor: colors.surface }]}
			>
				<MaterialIcons
					name='error-outline'
					size={64}
					color={colors.error}
					style={styles.errorIcon}
				/>
				<Text style={[styles.errorTitle, { color: colors.text }]}>
					Unable to Load Document
				</Text>
				<Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
					{error?.message || 'There was a problem loading this document.'}
				</Text>
			</View>
		);
	};

	// Loading state
	const renderLoading = () => {
		return (
			<View
				style={[
					styles.loadingContainer,
					{ backgroundColor: colors.surface },
					style,
				]}
			>
				{/* Show skeleton loader for different document types */}
				{type === 'pdf' ? (
					<SkeletonLoader
						width={WIDTH - 32}
						height={HEIGHT * 0.7}
						style={styles.skeletonPdf}
					/>
				) : ['txt', 'md', 'json', 'csv', 'xml', 'html'].includes(type) ? (
					<View style={styles.textSkeletonContainer}>
						<SkeletonLoader
							width='100%'
							height={16}
							style={styles.skeletonLine}
						/>
						<SkeletonLoader
							width='90%'
							height={16}
							style={styles.skeletonLine}
						/>
						<SkeletonLoader
							width='95%'
							height={16}
							style={styles.skeletonLine}
						/>
						<SkeletonLoader
							width='85%'
							height={16}
							style={styles.skeletonLine}
						/>
						<SkeletonLoader
							width='70%'
							height={16}
							style={styles.skeletonLine}
						/>
						<SkeletonLoader
							width='80%'
							height={16}
							style={styles.skeletonLine}
						/>
					</View>
				) : (
					<ActivityIndicator
						size='large'
						color={colors.primary}
						style={styles.activityIndicator}
					/>
				)}
			</View>
		);
	};

	// Choose the appropriate viewer based on document type
	const renderDocument = () => {
		// If there's an error, show error state
		if (error) {
			return renderError();
		}

		// If still loading, show the skeleton/spinner
		if (isLoading) {
			return renderLoading();
		}

		// Otherwise, choose the appropriate viewer
		switch (type) {
			case 'pdf':
				return renderPdfViewer();

			case 'txt':
			case 'md':
			case 'json':
			case 'csv':
			case 'xml':
			case 'html':
			case 'js':
			case 'css':
				return renderTextViewer();

			case 'doc':
			case 'docx':
			case 'xls':
			case 'xlsx':
			case 'ppt':
			case 'pptx':
				return renderOfficeViewer();

			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
			case 'bmp':
			case 'webp':
			case 'svg':
				return renderImageViewer();

			default:
				// For unsupported types, show error
				if (!error) {
					setError({ message: `Unsupported document type: ${type}` });
				}
				return renderError();
		}
	};

	return <View style={[styles.container, style]}>{renderDocument()}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	documentContainer: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	pdfContainer: {
		flex: 1,
		width: WIDTH,
		height: HEIGHT,
	},
	webviewContainer: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	activityIndicator: {
		marginBottom: 20,
	},
	skeletonPdf: {
		borderRadius: 8,
	},
	pageIndicator: {
		position: 'absolute',
		bottom: 24,
		alignSelf: 'center',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	pageIndicatorText: {
		fontSize: 14,
		fontFamily: 'Inter_500Medium',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorIcon: {
		marginBottom: 16,
	},
	errorTitle: {
		fontSize: 20,
		fontFamily: 'Inter_600SemiBold',
		marginBottom: 8,
		textAlign: 'center',
	},
	errorMessage: {
		fontSize: 16,
		fontFamily: 'Inter_400Regular',
		textAlign: 'center',
		paddingHorizontal: 32,
		lineHeight: 22,
	},
	textSkeletonContainer: {
		width: '100%',
		padding: 16,
	},
	skeletonLine: {
		marginBottom: 12,
		borderRadius: 4,
	},
});

export default DocumentViewer;
