import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import GoogleTranslateElementService, { GoogleTranslateElementConfig } from '@/services/googleTranslateElementService';

interface GoogleTranslateWidgetProps {
  config?: GoogleTranslateElementConfig;
  style?: any;
  onLanguageChange?: (languageCode: string) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export const GoogleTranslateWidget: React.FC<GoogleTranslateWidgetProps> = ({
  config = {},
  style,
  onLanguageChange,
  onReady,
  onError,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const serviceRef = useRef<GoogleTranslateElementService | null>(null);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        serviceRef.current = GoogleTranslateElementService.getInstance();
        
        // Initialize the service
        await serviceRef.current.initialize({
          pageLanguage: 'en',
          includedLanguages: 'hi,kn,ta,mr,gu,te,bn,ml,pa,or,as',
          layout: 'SIMPLE',
          autoDisplay: false,
          ...config,
        });

        setIsReady(true);
        onReady?.();

        // Set up language change listener for web
        if (Platform.OS === 'web') {
          const checkLanguageChange = () => {
            const newLanguage = serviceRef.current?.getCurrentLanguage() || 'en';
            if (newLanguage !== currentLanguage) {
              setCurrentLanguage(newLanguage);
              onLanguageChange?.(newLanguage);
            }
          };

          // Check for language changes periodically
          const interval = setInterval(checkLanguageChange, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to initialize Google Translate widget:', error);
        onError?.(error as Error);
      }
    };

    initializeWidget();

    return () => {
      // Cleanup
      if (serviceRef.current) {
        serviceRef.current.destroy();
      }
    };
  }, [config, onLanguageChange, onReady, onError, currentLanguage]);

  // For web platform, render the widget container
  if (Platform.OS === 'web') {
    return (
      <View ref={containerRef} style={[styles.container, style]}>
        <div id="google_translate_element" style={styles.webContainer} />
        {!isReady && (
          <View style={styles.loadingContainer}>
            <div style={styles.loadingText}>Loading translator...</div>
          </View>
        )}
      </View>
    );
  }

  // For mobile platforms, show a message or fallback
  return (
    <View style={[styles.container, styles.mobileContainer, style]}>
      <div style={styles.mobileMessage}>
        Google Translate Element is not available on mobile platforms.
        Please use the web version or implement a mobile-specific translation solution.
      </div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webContainer: {
    width: '100%',
    minHeight: 40,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  mobileContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 8,
  },
  mobileMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default GoogleTranslateWidget; 