# Google Translate API Setup Guide

This app uses Google Translate API to automatically translate all content to the user's selected language. Follow these steps to set up the API:

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Translation API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click on it and press "Enable"

## 2. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to Cloud Translation API for security

## 3. Configure the API Key

### Option A: Environment Variable (Recommended)
1. Create a `.env` file in your project root
2. Add your API key:
   ```
   EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_actual_api_key_here
   ```

### Option B: Direct Configuration
1. Open `config/api.ts`
2. Replace `'YOUR_GOOGLE_TRANSLATE_API_KEY'` with your actual API key

## 4. Supported Languages

The app supports the following Indian languages:
- English (en)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Marathi (mr)
- Tamil (ta)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Odia (or)
- Assamese (as)

## 5. How It Works

1. **Language Selection**: Users select their preferred language on the first screen
2. **Automatic Translation**: All text content is automatically translated using Google Translate API
3. **Caching**: Translations are cached to avoid repeated API calls
4. **Fallback**: If API is unavailable, fallback translations are used

## 6. Features

- **Real-time Translation**: All UI text is translated instantly
- **Cart Notifications**: Cart notifications appear in the selected language
- **Product Information**: Product names, descriptions, and categories are translated
- **Offline Support**: Fallback translations work without internet

## 7. Cost Considerations

- Google Translate API charges per character translated
- First 500,000 characters per month are free
- After that, it's $20 per million characters
- Consider implementing more aggressive caching for production use

## 8. Testing

1. Run the app
2. Select different languages on the language selection screen
3. Navigate through the app to see translated content
4. Add items to cart to see translated notifications

## 9. Troubleshooting

- **API Key Error**: Make sure your API key is correct and has Cloud Translation API enabled
- **Translation Not Working**: Check your internet connection and API quota
- **Fallback Translations**: If API fails, the app will use pre-defined fallback translations

## 10. Security Notes

- Never commit your API key to version control
- Use environment variables for production
- Consider restricting your API key to specific domains/IPs
- Monitor your API usage to avoid unexpected charges 