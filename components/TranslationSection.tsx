import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Globe, Languages } from 'lucide-react-native';
import GoogleTranslateWidget from './GoogleTranslateWidget';
import useGoogleTranslateElement from '@/hooks/useGoogleTranslateElement';

interface TranslationSectionProps {
  style?: any;
}

export const TranslationSection: React.FC<TranslationSectionProps> = ({ style }) => {
  const [showTranslationWidget, setShowTranslationWidget] = useState(false);
  
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
      console.log('Google Translate language changed to:', languageCode);
    },
    onReady: () => {
      console.log('Google Translate Element is ready');
    },
    onError: (error) => {
      console.error('Google Translate Element error:', error);
      Alert.alert('Translation Error', error.message);
    },
  });

  const handleInitializeTranslator = async () => {
    try {
      await initialize();
      Alert.alert('Success', 'Google Translate Element initialized successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize Google Translate Element');
    }
  };

  if (!isSupported) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Translation Options</Text>
        <View style={styles.mobileMessage}>
          <Text style={styles.mobileMessageText}>
            Google Translate Element is not available on mobile platforms.
          </Text>
          <Text style={styles.mobileMessageText}>
            Use the app's built-in translation feature instead.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Translation Options</Text>
      
      <View style={styles.translationContainer}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowTranslationWidget(!showTranslationWidget)}
        >
          <Globe size={24} color="#007AFF" />
          <Text style={styles.optionText}>
            {showTranslationWidget ? 'Hide' : 'Show'} Google Translate Widget
          </Text>
        </TouchableOpacity>

        {!isReady && !isLoading && (
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleInitializeTranslator}
          >
            <Languages size={24} color="#007AFF" />
            <Text style={styles.optionText}>Initialize Google Translate</Text>
          </TouchableOpacity>
        )}

        {isReady && (
          <View style={styles.languageButtons}>
            <TouchableOpacity 
              style={[styles.languageButton, currentLanguage === 'hi' && styles.activeLanguage]}
              onPress={() => changeLanguage('hi')}
            >
              <Text style={styles.languageButtonText}>हिंदी</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageButton, currentLanguage === 'ta' && styles.activeLanguage]}
              onPress={() => changeLanguage('ta')}
            >
              <Text style={styles.languageButtonText}>தமிழ்</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageButton, currentLanguage === 'bn' && styles.activeLanguage]}
              onPress={() => changeLanguage('bn')}
            >
              <Text style={styles.languageButtonText}>বাংলা</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageButton, currentLanguage === 'en' && styles.activeLanguage]}
              onPress={restore}
            >
              <Text style={styles.languageButtonText}>English</Text>
            </TouchableOpacity>
          </View>
        )}

        {showTranslationWidget && (
          <View style={styles.widgetContainer}>
            <GoogleTranslateWidget
              config={{
                pageLanguage: 'en',
                includedLanguages: 'hi,kn,ta,mr,gu,te,bn,ml,pa,or,as',
                layout: 'SIMPLE',
                autoDisplay: false,
              }}
            />
          </View>
        )}

        {error && (
          <Text style={styles.errorText}>Translation Error: {error.message}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  translationContainer: {
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeLanguage: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#333',
  },
  widgetContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 10,
  },
  mobileMessage: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  mobileMessageText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default TranslationSection; 