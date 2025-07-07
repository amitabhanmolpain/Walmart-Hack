import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { User, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight, Globe, LogIn, UserPlus, Languages } from 'lucide-react-native';
import { languages } from '@/constants/languages';
import LoginModal from '@/components/LoginModal';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';
import useGoogleTranslateElement from '@/hooks/useGoogleTranslateElement';

export default function ProfileScreen() {
  const { t, selectedLanguage, setSelectedLanguage, outstandingAmount } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });
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
      // You can sync this with your app's language state if needed
    },
    onReady: () => {
      console.log('Google Translate Element is ready');
    },
    onError: (error) => {
      console.error('Google Translate Element error:', error);
      Alert.alert('Translation Error', error.message);
    },
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserData({
      name: 'User',
      email: '',
      phone: '',
      avatar: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=200'
    });
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            setIsLoggedIn(false);
            setUserData({
              name: '',
              email: '',
              phone: '',
              avatar: ''
            });
          }
        },
      ]
    );
  };

  const menuItems = isLoggedIn ? [
    { icon: User, label: 'My Account', color: '#1565C0' },
    { icon: Globe, label: 'Language', color: '#9C27B0' },
    { icon: Settings, label: 'Settings', color: '#4CAF50' },
    { icon: HelpCircle, label: 'Help & Support', color: '#FF9800' },
    { icon: LogOut, label: 'Logout', color: '#E53935' },
  ] : [
    { icon: Globe, label: 'Language', color: '#9C27B0' },
    { icon: Settings, label: 'Settings', color: '#4CAF50' },
    { icon: HelpCircle, label: 'Help & Support', color: '#FF9800' },
  ];

  const handleInitializeTranslator = async () => {
    try {
      await initialize();
      Alert.alert('Success', 'Google Translate Element initialized successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize Google Translate Element');
    }
  };

  const profileOptions = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: User,
      onPress: () => Alert.alert('Account Settings', 'Account settings screen'),
    },
    {
      id: 'settings',
      title: 'App Settings',
      icon: Settings,
      onPress: () => Alert.alert('App Settings', 'App settings screen'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => Alert.alert('Help & Support', 'Help and support screen'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {isLoggedIn ? (
            <>
              <Image
                source={{ uri: userData.avatar }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                {userData.email && <Text style={styles.profileEmail}>{userData.email}</Text>}
                {userData.phone && <Text style={styles.profilePhone}>{userData.phone}</Text>}
              </View>
            </>
          ) : (
            <>
              <View style={styles.profileImagePlaceholder}>
                <User size={40} color="#ccc" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>Sign in to access your account</Text>
              </View>
              <View style={styles.loginButtons}>
                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={() => setShowLoginModal(true)}
                >
                  <LogIn size={16} color="#fff" />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.registerButton} 
                  onPress={() => setShowLoginModal(true)}
                >
                  <UserPlus size={16} color="#1565C0" />
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Outstanding Amount Section */}
        {outstandingAmount > 0 && (
          <View style={styles.outstandingSection}>
            <View style={styles.outstandingHeader}>
              <Text style={styles.outstandingTitle}>Outstanding Amount</Text>
              <Text style={styles.outstandingAmount}>₹{outstandingAmount.toFixed(2)}</Text>
            </View>
            <Text style={styles.outstandingSubtext}>
              Amount due for orders with "Pay in 7 Days" option
            </Text>
          </View>
        )}

        {/* Translation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translation Options</Text>
          
          {Platform.OS === 'web' ? (
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
          ) : (
            <View style={styles.mobileMessage}>
              <Text style={styles.mobileMessageText}>
                Google Translate Element is not available on mobile platforms.
              </Text>
              <Text style={styles.mobileMessageText}>
                Use the app's built-in translation feature instead.
              </Text>
            </View>
          )}

          {/* App Language Selection */}
          <View style={styles.languageSection}>
            <Text style={styles.subsectionTitle}>App Language</Text>
            <View style={styles.languageOptions}>
              {['en', 'hi', 'ta', 'bn'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang && styles.selectedLanguage
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={[
                    styles.languageOptionText,
                    selectedLanguage === lang && styles.selectedLanguageText
                  ]}>
                    {lang === 'en' ? 'English' : 
                     lang === 'hi' ? 'हिंदी' : 
                     lang === 'ta' ? 'தமிழ்' : 'বাংলা'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={option.onPress}
            >
              <option.icon size={24} color="#007AFF" />
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              activeOpacity={0.8}
              onPress={() => {
                if (item.label === 'Language') {
                  // Show language selection modal or navigate to language screen
                  // For now, just cycle through languages
                  const currentIndex = languages.findIndex(lang => lang.code === selectedLanguage);
                  const nextIndex = (currentIndex + 1) % languages.length;
                  setSelectedLanguage(languages[nextIndex].code);
                } else if (item.label === 'Logout') {
                  handleLogout();
                }
              }}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>
                {item.label === 'Language' ? `${item.label} (${languages.find(lang => lang.code === selectedLanguage)?.name})` : item.label}
              </Text>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Walmart Viradhi v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Login Modal */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  versionSection: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loginButtons: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1565C0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginLeft: 8,
  },
  outstandingSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  outstandingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outstandingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  outstandingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  outstandingSubtext: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  translationContainer: {
    marginBottom: 20,
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
    marginBottom: 20,
  },
  mobileMessageText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
  languageSection: {
    marginTop: 20,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  languageOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
    fontWeight: '600',
  },
});