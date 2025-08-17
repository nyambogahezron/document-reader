import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

interface SharedElementWrapperProps {
	children: ReactNode;
	sharedElementId?: string;
	style?: ViewStyle;
}

const SharedElementWrapper: React.FC<SharedElementWrapperProps> = ({
	children,
	sharedElementId,
	style,
}) => {
	// Simple wrapper for now - can be enhanced with proper shared element transitions
	return <View style={style}>{children}</View>;
};

export default SharedElementWrapper;
