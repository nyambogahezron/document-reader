/**
 * Animation utility functions and constants
 */
import { Animated, Easing } from 'react-native';

/**
 * Standard animation durations in milliseconds
 */
export const DURATIONS = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  medium: 400,
  long: 500,
};

/**
 * Standard easing functions
 */
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
};

/**
 * Spring animation configurations
 */
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
    tension: 300,
    friction: 20,
    useNativeDriver: true,
  },
  slow: {
    tension: 20,
    friction: 5,
    useNativeDriver: true,
  },
};

/**
 * Create a staggered animation sequence
 * @param {Array} animations - Array of animation configurations to run in sequence
 * @param {number} staggerDelay - Delay between each animation (ms)
 * @returns {Animated.CompositeAnimation} Composite animation that can be started
 */
export const staggered = (animations, staggerDelay = 100) => {
  return Animated.stagger(
    staggerDelay,
    animations.map((anim) => {
      if (typeof anim === 'function') {
        return anim();
      }
      return anim;
    })
  );
};

/**
 * Create a custom bezier easing function
 * @param {number} x1 - First control point x
 * @param {number} y1 - First control point y
 * @param {number} x2 - Second control point x
 * @param {number} y2 - Second control point y
 * @returns {function} Easing function
 */
export const createBezierEasing = (x1, y1, x2, y2) => {
  return Easing.bezier(x1, y1, x2, y2);
};

/**
 * Common animation presets that can be used directly
 */
export const ANIMATION_PRESETS = {
  /**
   * Fade in animation
   * @param {Animated.Value} value - Animated value to animate
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  fadeIn: (value, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Fade out animation
   * @param {Animated.Value} value - Animated value to animate
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  fadeOut: (value, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Slide in from bottom animation
   * @param {Animated.Value} value - Animated value to animate
   * @param {number} distance - Distance to slide from
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  slideInUp: (value, distance = 100, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Slide out to bottom animation
   * @param {Animated.Value} value - Animated value to animate
   * @param {number} distance - Distance to slide to
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  slideOutDown: (value, distance = 100, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: distance,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Pop in animation (scale from 0 to 1)
   * @param {Animated.Value} value - Animated value to animate
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  popIn: (value, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Pop out animation (scale from 1 to 0)
   * @param {Animated.Value} value - Animated value to animate
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  popOut: (value, options = {}) => {
    const {
      duration = DURATIONS.standard,
      easing = EASINGS.easeOut,
      useNativeDriver = true,
    } = options;
    
    return Animated.timing(value, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver,
    });
  },
  
  /**
   * Bounce animation
   * @param {Animated.Value} value - Animated value to animate
   * @param {number} toValue - Target value to animate to
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  bounce: (value, toValue = 1, options = {}) => {
    const { useNativeDriver = true } = options;
    
    return Animated.spring(value, {
      toValue,
      friction: 3,
      tension: 40,
      useNativeDriver,
    });
  },
  
  /**
   * Pulse animation (subtle scale up and down)
   * @param {Animated.Value} value - Animated value to animate
   * @param {Object} options - Optional configuration
   * @returns {Animated.CompositeAnimation} Animation that can be started
   */
  pulse: (value, options = {}) => {
    const { useNativeDriver = true } = options;
    
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 300,
        useNativeDriver,
      }),
    ]);
  },
};