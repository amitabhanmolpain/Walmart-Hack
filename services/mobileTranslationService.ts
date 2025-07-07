import axios from 'axios';
import API_CONFIG from '@/config/api';

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export class MobileTranslationService {
  private static instance: MobileTranslationService;
  private apiKey: string;

  private constructor() {
    this.apiKey = API_CONFIG.GOOGLE_TRANSLATE_API_KEY;
  }

  public static getInstance(): MobileTranslationService {
    if (!MobileTranslationService.instance) {
      MobileTranslationService.instance = new MobileTranslationService();
    }
    return MobileTranslationService.instance;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResponse> {
    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      return {
        translatedText: translationCache.get(cacheKey)!,
        detectedSourceLanguage: sourceLanguage,
      };
    }

    try {
      // If no API key is set, return the original text
      if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
        console.warn('Google Translate API key not configured. Using fallback translations.');
        return this.getFallbackTranslation(text, targetLanguage);
      }

      const response = await axios.post(
        `${API_CONFIG.GOOGLE_TRANSLATE_BASE_URL}?key=${this.apiKey}`,
        {
          q: text,
          target: API_CONFIG.LANGUAGE_CODES[targetLanguage as keyof typeof API_CONFIG.LANGUAGE_CODES] || targetLanguage,
          source: API_CONFIG.LANGUAGE_CODES[sourceLanguage as keyof typeof API_CONFIG.LANGUAGE_CODES] || sourceLanguage,
        }
      );

      const translatedText = response.data.data.translations[0].translatedText;
      
      // Cache the translation
      translationCache.set(cacheKey, translatedText);

      return {
        translatedText,
        detectedSourceLanguage: response.data.data.translations[0].detectedSourceLanguage,
      };
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to cached translations or original text
      return this.getFallbackTranslation(text, targetLanguage);
    }
  }

  private getFallbackTranslation(text: string, targetLanguage: string): TranslationResponse {
    // Fallback translations for common UI elements
    const fallbackTranslations: Record<string, Record<string, string>> = {
      'Home': {
        hi: 'घर',
        kn: 'ಮುಖ್ಯ',
        ta: 'முகப்பு',
        mr: 'मुख्यपृष्ठ',
        gu: 'ઘર',
        te: 'హోమ్',
        bn: 'হোম',
        ml: 'ഹോം',
        pa: 'ਹੋਮ',
        or: 'ହୋମ',
        as: 'হোম',
      },
      'Categories': {
        hi: 'श्रेणियां',
        kn: 'ವರ್ಗಗಳು',
        ta: 'பகுதிகள்',
        mr: 'श्रेणी',
        gu: 'શ્રેણીઓ',
        te: 'వర్గాలు',
        bn: 'বিভাগসমূহ',
        ml: 'വിഭാഗങ്ങൾ',
        pa: 'ਵਰਗ',
        or: 'ବର୍ଗ',
        as: 'বিভাগসমূহ',
      },
      'Cart': {
        hi: 'कार्ट',
        kn: 'ಕಾರ್ಟ್',
        ta: 'கார்ட்',
        mr: 'कार्ट',
        gu: 'કાર્ટ',
        te: 'కార్ట్',
        bn: 'কার্ট',
        ml: 'കാർട്ട്',
        pa: 'ਕਾਰਟ',
        or: 'କାର୍ଟ',
        as: 'কার্ট',
      },
      'Profile': {
        hi: 'प्रोफाइल',
        kn: 'ಪ್ರೊಫೈಲ್',
        ta: 'சுயவிவரம்',
        mr: 'प्रोफाइल',
        gu: 'પ્રોફાઇલ',
        te: 'ప్రొఫైల్',
        bn: 'প্রোফাইল',
        ml: 'പ്രൊഫൈൽ',
        pa: 'ਪ੍ਰੋਫਾਈਲ',
        or: 'ପ୍ରୋଫାଇଲ',
        as: 'প্রোফাইল',
      },
      'Add to Cart': {
        hi: 'कार्ट में जोड़ें',
        kn: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
        ta: 'கார்ட்டில் சேர்க்கவும்',
        mr: 'कार्टमध्ये जोडा',
        gu: 'કાર્ટમાં ઉમેરો',
        te: 'కార్ట్‌కు జోడించు',
        bn: 'কার্টে যোগ করুন',
        ml: 'കാർട്ടിലേക്ക് ചേർക്കുക',
        pa: 'ਕਾਰਟ ਵਿੱਚ ਜੋੜੋ',
        or: 'କାର୍ଟରେ ଯୋଡ଼ନ୍ତୁ',
        as: 'কার্টত যোগ কৰক',
      },
    };

    // Check if we have a fallback translation
    if (fallbackTranslations[text] && fallbackTranslations[text][targetLanguage]) {
      return {
        translatedText: fallbackTranslations[text][targetLanguage],
        detectedSourceLanguage: 'en',
      };
    }

    // Return original text if no fallback found
    return {
      translatedText: text,
      detectedSourceLanguage: 'en',
    };
  }

  public clearCache(): void {
    translationCache.clear();
  }

  public async translateMultipleTexts(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResponse[]> {
    const results = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage, sourceLanguage))
    );
    return results;
  }
}

export default MobileTranslationService; 