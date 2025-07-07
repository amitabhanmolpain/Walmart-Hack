import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TranslationSection from '@/components/TranslationSection';
import TranslationDemo from '@/components/TranslationDemo';

export const TranslationExample: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Google Translate Element Integration</Text>
        <Text style={styles.subtitle}>
          This example shows how to integrate Google Translate Element into your app
        </Text>
      </View>

      {/* Simple Integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simple Integration</Text>
        <Text style={styles.description}>
          Add this component to any screen to enable Google Translate Element:
        </Text>
        <TranslationSection />
      </View>

      {/* Full Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Demo</Text>
        <Text style={styles.description}>
          Complete demo with all features and controls:
        </Text>
        <TranslationDemo />
      </View>

      {/* Usage Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            1. Import the TranslationSection component:
          </Text>
          <Text style={styles.codeText}>
            import TranslationSection from '@/components/TranslationSection';
          </Text>
          
          <Text style={styles.instructionText}>
            2. Add it to your screen:
          </Text>
          <Text style={styles.codeText}>
            {'<TranslationSection />'}
          </Text>
          
          <Text style={styles.instructionText}>
            3. For web platforms, the widget will automatically load and work
          </Text>
          
          <Text style={styles.instructionText}>
            4. For mobile platforms, it will show a fallback message
          </Text>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.features}>
          <Text style={styles.featureText}>✅ Free translation service</Text>
          <Text style={styles.featureText}>✅ No API key required</Text>
          <Text style={styles.featureText}>✅ Automatic script loading</Text>
          <Text style={styles.featureText}>✅ Multiple language support</Text>
          <Text style={styles.featureText}>✅ Platform-specific handling</Text>
          <Text style={styles.featureText}>✅ Easy integration</Text>
        </View>
      </View>

      {/* Supported Languages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Languages</Text>
        <View style={styles.languages}>
          <Text style={styles.languageText}>🇮🇳 Hindi (हिंदी)</Text>
          <Text style={styles.languageText}>🇮🇳 Kannada (ಕನ್ನಡ)</Text>
          <Text style={styles.languageText}>🇮🇳 Tamil (தமிழ்)</Text>
          <Text style={styles.languageText}>🇮🇳 Marathi (मराठी)</Text>
          <Text style={styles.languageText}>🇮🇳 Gujarati (ગુજરાતી)</Text>
          <Text style={styles.languageText}>🇮🇳 Telugu (తెలుగు)</Text>
          <Text style={styles.languageText}>🇮🇳 Bengali (বাংলা)</Text>
          <Text style={styles.languageText}>🇮🇳 Malayalam (മലയാളം)</Text>
          <Text style={styles.languageText}>🇮🇳 Punjabi (ਪੰਜਾਬੀ)</Text>
          <Text style={styles.languageText}>🇮🇳 Odia (ଓଡ଼ିଆ)</Text>
          <Text style={styles.languageText}>🇮🇳 Assamese (অসমীয়া)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  instructions: {
    marginTop: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  codeText: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    fontFamily: 'monospace',
  },
  features: {
    marginTop: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  languages: {
    marginTop: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default TranslationExample; 