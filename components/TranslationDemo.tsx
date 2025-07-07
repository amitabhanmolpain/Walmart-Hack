import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import GoogleTranslateWidget from './GoogleTranslateWidget';
import useGoogleTranslateElement from '@/hooks/useGoogleTranslateElement';

export const TranslationDemo: React.FC = () => {
  const [showWidget, setShowWidget] = useState(false);
  
  const {
    isReady,
    isLoading,
    error,
    currentLanguage,
    initialize,
    changeLanguage,
    restore,
    isSupported,
  } = useGoogleTranslateElement({
    onLanguageChange: (languageCode) => {
      console.log('Language changed to:', languageCode);
      Alert.alert('Language Changed', `App language changed to: ${languageCode}`);
    },
    onReady: () => {
      console.log('Google Translate Element is ready');
      Alert.alert('Ready', 'Google Translate Element is ready to use!');
    },
    onError: (error) => {
      console.error('Google Translate Element error:', error);
      Alert.alert('Error', `Translation error: ${error.message}`);
    },
  });

  const handleInitialize = async () => {
    try {
      await initialize();
    } catch (error) {
      Alert.alert('Initialization Error', 'Failed to initialize Google Translate Element');
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const handleRestore = () => {
    restore();
  };

  if (!isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Google Translate Element Demo</Text>
        <View style={styles.mobileMessage}>
          <Text style={styles.messageText}>
            Google Translate Element is primarily designed for web platforms.
          </Text>
          <Text style={styles.messageText}>
            For mobile apps, consider using the Google Cloud Translation API or other mobile-specific translation solutions.
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Alternative Solutions for Mobile:</Text>
          <Text style={styles.infoText}>• Google Cloud Translation API</Text>
          <Text style={styles.infoText}>• Microsoft Translator API</Text>
          <Text style={styles.infoText}>• DeepL API</Text>
          <Text style={styles.infoText}>• Local translation libraries</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Translate Element Demo</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isLoading ? 'Loading...' : isReady ? 'Ready' : 'Not Initialized'}
        </Text>
        {error && (
          <Text style={styles.errorText}>Error: {error.message}</Text>
        )}
        <Text style={styles.statusText}>
          Current Language: {currentLanguage}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isReady && !isLoading && (
          <TouchableOpacity style={styles.button} onPress={handleInitialize}>
            <Text style={styles.buttonText}>Initialize Translator</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.toggleButton]} 
          onPress={() => setShowWidget(!showWidget)}
        >
          <Text style={styles.buttonText}>
            {showWidget ? 'Hide' : 'Show'} Translation Widget
          </Text>
        </TouchableOpacity>

        {isReady && (
          <>
            <TouchableOpacity 
              style={[styles.button, styles.languageButton]} 
              onPress={() => handleLanguageChange('hi')}
            >
              <Text style={styles.buttonText}>Switch to Hindi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.languageButton]} 
              onPress={() => handleLanguageChange('ta')}
            >
              <Text style={styles.buttonText}>Switch to Tamil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.languageButton]} 
              onPress={() => handleLanguageChange('bn')}
            >
              <Text style={styles.buttonText}>Switch to Bengali</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.restoreButton]} 
              onPress={handleRestore}
            >
              <Text style={styles.buttonText}>Restore to English</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {showWidget && (
        <View style={styles.widgetContainer}>
          <Text style={styles.widgetTitle}>Translation Widget:</Text>
          <GoogleTranslateWidget
            config={{
              pageLanguage: 'en',
              includedLanguages: 'hi,kn,ta,mr,gu,te,bn,ml,pa,or,as',
              layout: 'SIMPLE',
              autoDisplay: false,
            }}
            onLanguageChange={(languageCode) => {
              console.log('Widget language changed to:', languageCode);
            }}
            onReady={() => {
              console.log('Widget is ready');
            }}
            onError={(error) => {
              console.error('Widget error:', error);
            }}
          />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>• Click "Initialize Translator" to load the Google Translate script</Text>
        <Text style={styles.infoText}>• Use the widget or buttons to change languages</Text>
        <Text style={styles.infoText}>• The widget will translate the entire page content</Text>
        <Text style={styles.infoText}>• Click "Restore" to return to English</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#28a745',
  },
  languageButton: {
    backgroundColor: '#ffc107',
  },
  restoreButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  widgetContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    lineHeight: 20,
  },
  mobileMessage: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default TranslationDemo; 