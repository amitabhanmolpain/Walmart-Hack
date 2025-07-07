import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import GoogleTranslateElementService, { GoogleTranslateElementConfig } from '@/services/googleTranslateElementService';

export interface UseGoogleTranslateElementOptions {
  config?: GoogleTranslateElementConfig;
  onLanguageChange?: (languageCode: string) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export const useGoogleTranslateElement = (options: UseGoogleTranslateElementOptions = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const serviceRef = useRef<GoogleTranslateElementService | null>(null);

  const initialize = useCallback(async () => {
    if (isReady) return;

    setIsLoading(true);
    setError(null);

    try {
      serviceRef.current = GoogleTranslateElementService.getInstance();
      
      await serviceRef.current.initialize({
        pageLanguage: 'en',
        includedLanguages: 'hi,kn,ta,mr,gu,te,bn,ml,pa,or,as',
        layout: 'SIMPLE',
        autoDisplay: false,
        ...options.config,
      });

      setIsReady(true);
      options.onReady?.();
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, options]);

  const changeLanguage = useCallback((languageCode: string) => {
    if (!serviceRef.current || !isReady) {
      console.warn('Google Translate service not ready');
      return;
    }

    try {
      serviceRef.current.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      options.onLanguageChange?.(languageCode);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    }
  }, [isReady, options]);

  const restore = useCallback(() => {
    if (!serviceRef.current || !isReady) {
      console.warn('Google Translate service not ready');
      return;
    }

    try {
      serviceRef.current.restore();
      setCurrentLanguage('en');
      options.onLanguageChange?.('en');
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    }
  }, [isReady, options]);

  const getCurrentLanguage = useCallback(() => {
    if (!serviceRef.current || !isReady) {
      return 'en';
    }

    try {
      return serviceRef.current.getCurrentLanguage();
    } catch (err) {
      console.error('Failed to get current language:', err);
      return 'en';
    }
  }, [isReady]);

  const destroy = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.destroy();
      setIsReady(false);
      setCurrentLanguage('en');
      setError(null);
    }
  }, []);

  // Monitor language changes for web platform
  useEffect(() => {
    if (!isReady || Platform.OS !== 'web') return;

    const checkLanguageChange = () => {
      const newLanguage = getCurrentLanguage();
      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
        options.onLanguageChange?.(newLanguage);
      }
    };

    const interval = setInterval(checkLanguageChange, 1000);
    return () => clearInterval(interval);
  }, [isReady, currentLanguage, getCurrentLanguage, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return {
    isReady,
    isLoading,
    error,
    currentLanguage,
    initialize,
    changeLanguage,
    restore,
    getCurrentLanguage,
    destroy,
    isSupported: Platform.OS === 'web',
  };
};

export default useGoogleTranslateElement; 