import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * A hook that provides access to the current theme context
 * 
 * @returns {object} The theme context containing colors, isDark, and setScheme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};