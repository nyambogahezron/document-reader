import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { ANIMATION_PRESETS } from '../utils/animationUtils';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const scrollX = useAnimatedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  
  // Opacity animations for buttons
  const skipButtonOpacity = useAnimatedValue(1);
  const getStartedButtonScale = useAnimatedValue(0);
  
  // Onboarding slides data
  const slides = [
    {
      id: '1',
      title: 'Organize Your Documents',
      description: 'Keep all your important documents in one place, neatly organized and easy to find.',
      image: require('../../assets/icon.png'),
    },
    {
      id: '2',
      title: 'Read on Any Device',
      description: 'Access your documents anytime, anywhere. Read PDFs, DOCs, and more with our powerful viewer.',
      image: require('../../assets/icon.png'),
    },
    {
      id: '3',
      title: 'Easy Sharing',
      description: 'Share your documents with others in just a few taps. Collaboration made simple.',
      image: require('../../assets/icon.png'),
    },
    {
      id: '4',
      title: 'Get Started Now',
      description: 'Your document management journey begins here. Let\'s get started!',
      image: require('../../assets/icon.png'),
    },
  ];
  
  // Handle slide change
  const handleSlideChange = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
    
    // Show or hide buttons based on slide index
    if (index === slides.length - 1) {
      // On last slide, show Get Started button and hide Skip button
      ANIMATION_PRESETS.fadeOut(skipButtonOpacity).start();
      ANIMATION_PRESETS.popIn(getStartedButtonScale).start();
    } else {
      // On other slides, show Skip button and hide Get Started button
      ANIMATION_PRESETS.fadeIn(skipButtonOpacity).start();
      ANIMATION_PRESETS.popOut(getStartedButtonScale).start();
    }
  };
  
  // Navigate to next slide
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };
  
  // Skip to main app
  const skipToMain = () => {
    navigation.replace('Main');
  };
  
  // Render individual slide
  const renderSlide = ({ item }) => {
    return (
      <View style={[styles.slide, { width, backgroundColor: colors.background }]}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    );
  };
  
  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          // Create animated styles for dots
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Skip button */}
      <Animated.View style={[styles.skipButtonContainer, { opacity: skipButtonOpacity }]}>
        <TouchableOpacity
          style={[styles.skipButton, { borderColor: colors.border }]}
          onPress={skipToMain}
        >
          <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleSlideChange}
        scrollEventThrottle={16}
      />
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Next button (not on last slide) */}
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={goToNextSlide}
          >
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
        
        {/* Get Started button (only on last slide) */}
        <Animated.View
          style={[
            styles.getStartedButtonContainer,
            { transform: [{ scale: getStartedButtonScale }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
            onPress={skipToMain}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  skipButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  getStartedButtonContainer: {
    width: '100%',
  },
  getStartedButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  getStartedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: 'white',
  },
});

export default OnboardingScreen;