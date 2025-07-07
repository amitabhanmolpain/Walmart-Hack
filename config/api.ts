// API Configuration
export const API_CONFIG = {
  // Google Translate API Key
  // Get your API key from: https://console.cloud.google.com/apis/credentials
  GOOGLE_TRANSLATE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY || 'YOUR_GOOGLE_TRANSLATE_API_KEY',
  
  // Base URLs
  GOOGLE_TRANSLATE_BASE_URL: 'https://translation.googleapis.com/language/translate/v2',
  
  // Language codes mapping for Google Translate
  LANGUAGE_CODES: {
    en: 'en',
    hi: 'hi',
    kn: 'kn',
    ta: 'ta',
    mr: 'mr',
    gu: 'gu',
    te: 'te',
    bn: 'bn',
    ml: 'ml',
    pa: 'pa',
    or: 'or',
    as: 'as',
  },
};

// Instructions for setting up Google Translate API:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select an existing one
// 3. Enable the Cloud Translation API
// 4. Create credentials (API Key)
// 5. Set the API key in your environment variables:
//    EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
// 6. Or replace 'YOUR_GOOGLE_TRANSLATE_API_KEY' with your actual API key

export default API_CONFIG; 