import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { languages } from '@/constants/languages';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LanguageSelection() {
  const router = useRouter();
  const { setSelectedLanguage } = useApp();

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#2196F3']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Globe size={48} color="#fff" />
        </View>
        <Text style={styles.title}>Walmart Viradhi</Text>
        <Text style={styles.subtitle}>अपनी भाषा चुनें / Choose Your Language</Text>
        <Text style={styles.description}>
          Select your preferred language to get the best shopping experience
        </Text>
      </LinearGradient>
      
      <ScrollView style={styles.languageContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.languageGrid}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageCard}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.8}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flag}>{language.flag}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
                <ArrowRight size={16} color="#1565C0" style={styles.arrow} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All content will be automatically translated to your selected language
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 20,
  },
  languageContainer: {
    flex: 1,
    padding: 20,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  languageCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrow: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 20,
  },
});