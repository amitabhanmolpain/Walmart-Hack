import axios from 'axios';
import API_CONFIG from '@/config/api';

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export class TranslationService {
  private static instance: TranslationService;
  private apiKey: string;

  private constructor() {
    this.apiKey = API_CONFIG.GOOGLE_TRANSLATE_API_KEY;
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
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
      'Item added to cart successfully!': {
        hi: 'आइटम कार्ट में सफलतापूर्वक जोड़ा गया!',
        kn: 'ಐಟಂ ಕಾರ್ಟ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!',
        ta: 'பொருள் கார்ட்டில் வெற்றிகரமாக சேர்க்கப்பட்டது!',
        mr: 'आयटम कार्टमध्ये यशस्वीरित्या जोडले गेले!',
        gu: 'આઇટમ કાર્ટમાં સફળતાપૂર્વક ઉમેરાયું!',
        te: 'ఐటమ్ కార్ట్‌లో విజయవంతంగా జోడించబడింది!',
        bn: 'আইটেম কার্টে সফলভাবে যোগ করা হয়েছে!',
        ml: 'ഇനം കാർട്ടിലേക്ക് വിജയകരമായി ചേർത്തു!',
        pa: 'ਆਈਟਮ ਕਾਰਟ ਵਿੱਚ ਸਫলਤਾਪੂਰਵਕ ਜੋੜਿਆ ਗਿਆ!',
        or: 'ଆଇଟମ କାର୍ଟରେ ସଫଳତାର ସହ ଯୋଡ଼ାଗଲା!',
        as: 'আইটেম কার্টত সফলভাৱে যোগ কৰা হল!',
      },
      'Own A Business?': {
        hi: 'व्यवसाय के मालिक हैं?',
        kn: 'ವ್ಯವಸಾಯದ ಮಾಲೀಕರೇ?',
        ta: 'வணிகம் உள்ளீர்களா?',
        mr: 'व्यवसायाचे मालक आहात?',
        gu: 'વ્યવસાયના માલિક છો?',
        te: 'వ్యాపారం యజమాని?',
        bn: 'ব্যবসার মালিক?',
        ml: 'ബിസിനസ്സ് ഉടമയാണോ?',
        pa: 'ਵਪਾਰ ਦੇ ਮਾਲਕ ਹੋ?',
        or: 'ବ୍ୟବସାୟର ମାଲିକ କି?',
        as: 'ব্যৱসায়ৰ মালিক?',
      },
      'Unlock exclusive benefits': {
        hi: 'विशेष लाभ प्राप्त करें',
        kn: 'ವಿಶೇಷ ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಿ',
        ta: 'சிறப்பு நன்மைகளைப் பெறுங்கள்',
        mr: 'विशेष फायदे मिळवा',
        gu: 'વિશેષ લાભ મેળવો',
        te: 'ప్రత్యేక ప్రయోజనాలను అన్లాక్ చేయండి',
        bn: 'বিশেষ সুবিধা আনলক করুন',
        ml: 'പ്രത്യേക ആനുകൂല്യങ്ങൾ അൺലോക്ക് ചെയ്യുക',
        pa: 'ਵਿਸ਼ੇਸ਼ ਲਾਭ ਅਨਲੌਕ ਕਰੋ',
        or: 'ବିଶେଷ ସୁବିଧା ଅନଲକ୍ କରନ୍ତୁ',
        as: 'বিশেষ সুবিধা আনলক কৰক',
      },
      'Become a member': {
        hi: 'सदस्य बनें',
        kn: 'ಸದಸ್ಯರಾಗಿ',
        ta: 'உறுப்பினராகுங்கள்',
        mr: 'सदस्य व्हा',
        gu: 'સભ્ય બનો',
        te: 'సభ్యుడు కండి',
        bn: 'সদস্য হন',
        ml: 'അംഗമാകുക',
        pa: 'ਮੈਂਬਰ ਬਣੋ',
        or: 'ସଦସ୍ୟ ହୁଅନ୍ତୁ',
        as: 'সদস্য হোন',
      },
      'PRESENTING': {
        hi: 'प्रस्तुत कर रहे हैं',
        kn: 'ಪ್ರಸ್ತುತಪಡಿಸುತ್ತಿದ್ದೇವೆ',
        ta: 'வழங்குகிறோம்',
        mr: 'सादर करत आहोत',
        gu: 'પ્રસ્તુત કરી રહ્યા છીએ',
        te: 'ప్రదర్శిస్తున్నాము',
        bn: 'উপস্থাপন করছি',
        ml: 'വാഗ്ദാനം ചെയ്യുന്നു',
        pa: 'ਪੇਸ਼ ਕਰ ਰਹੇ ਹਾਂ',
        or: 'ପ୍ରଦାନ କରୁଛି',
        as: 'প্ৰদান কৰিছোঁ',
      },
      '5% CASHBACK CREDIT CARD': {
        hi: '5% कैशबैक क्रेडिट कार्ड',
        kn: '5% ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
        ta: '5% கேஷ்பேக் கிரெடிட் கார்டு',
        mr: '5% कॅशबॅक क्रेडिट कार्ड',
        gu: '5% કેશબેક ક્રેડિટ કાર્ડ',
        te: '5% క్యాష్‌బ్యాక్ క్రెడిట్ కార్డ్',
        bn: '5% ক্যাশব্যাক ক্রেডিট কার্ড',
        ml: '5% കാഷ്‌ബാക്ക് ക്രെഡിറ്റ് കാർഡ്',
        pa: '5% ਕੈਸ਼ਬੈਕ ਕ੍ਰੈਡਿਟ ਕਾਰਡ',
        or: '5% କ୍ୟାଶବ୍ୟାକ୍ କ୍ରେଡିଟ୍ କାର୍ଡ',
        as: '5% কেচবেক ক্ৰেডিট কাৰ্ড',
      },
      'Flipkart Wholesale': {
        hi: 'फ्लिपकार्ट होलसेल',
        kn: 'ಫ್ಲಿಪ್‌ಕಾರ್ಟ್ ಹೋಲ್‌ಸೇಲ್',
        ta: 'ஃபிளிப்கார்ட் மொத்த விற்பனை',
        mr: 'फ्लिपकार्ट होलसेल',
        gu: 'ફ્લિપ્કાર્ટ હોલસેલ',
        te: 'ఫ్లిప్‌కార్ట్ హోల్‌సేల్',
        bn: 'ফ্লিপকার্ট হোলসেল',
        ml: 'ഫ്ലിപ്കാർട്ട് ഹോൾസെയിൽ',
        pa: 'ਫਲਿਪਕਾਰਟ ਹੋਲਸੇਲ',
        or: 'ଫ୍ଲିପ୍କାର୍ଟ ହୋଲସେଲ',
        as: 'ফ্লিপকাৰ্ট হোলচেল',
      },
      'On FLIPKART WHOLESALE': {
        hi: 'फ्लिपकार्ट होलसेल पर',
        kn: 'ಫ್ಲಿಪ್‌ಕಾರ್ಟ್ ಹೋಲ್‌ಸೇಲ್‌ನಲ್ಲಿ',
        ta: 'ஃபிளிப்கார்ட் மொத்த விற்பனையில்',
        mr: 'फ्लिपकार्ट होलसेल वर',
        gu: 'ફ્લિપ્કાર્ટ હોલસેલ પર',
        te: 'ఫ్లిప్‌కార్ట్ హోల్‌సేల్‌లో',
        bn: 'ফ্লিপকার্ট হোলসেলে',
        ml: 'ഫ്ലിപ്കാർട്ട് ഹോൾസെയിലിൽ',
        pa: 'ਫਲਿਪਕਾਰਟ ਹੋਲਸੇਲ ਤੇ',
        or: 'ଫ୍ଲିପ୍କାର୍ଟ ହୋଲସେଲରେ',
        as: 'ফ্লিপকাৰ্ট হোলচেলত',
      },
      'Online Spends': {
        hi: 'ऑनलाइन खर्च',
        kn: 'ಆನ್‌ಲೈನ್ ಖರ್ಚು',
        ta: 'ஆன்லைன் செலவுகள்',
        mr: 'ऑनलाइन खर्च',
        gu: 'ઓનલાઇન ખર્ચ',
        te: 'ఆన్‌లైన్ ఖర్చులు',
        bn: 'অনলাইন ব্যয়',
        ml: 'ഓൺലൈൻ ചെലവുകൾ',
        pa: 'ਆਨਲਾਈਨ ਖਰਚ',
        or: 'ଅନଲାଇନ୍ ବ୍ୟୟ',
        as: 'অনলাইন ব্যয়',
      },
      'APPLY NOW ▶': {
        hi: 'अभी आवेदन करें ▶',
        kn: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ▶',
        ta: 'இப்போது விண்ணப்பிக்கவும் ▶',
        mr: 'आता अर्ज करा ▶',
        gu: 'હવે અરજી કરો ▶',
        te: 'ఇప్పుడు దరఖాస్తు చేయండి ▶',
        bn: 'এখনই আবেদন করুন ▶',
        ml: 'ഇപ്പോൾ അപേക്ഷിക്കുക ▶',
        pa: 'ਹੁਣ ਅਰਜ਼ੀ ਦਿਓ ▶',
        or: 'ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ ▶',
        as: 'এতিয়াই আবেদন কৰক ▶',
      },
      'quickLinks': {
        hi: 'त्वरित लिंक',
        kn: 'ತ್ವರಿತ ಲಿಂಕ್ಸ್',
        ta: 'விரைவு இணைப்புகள்',
        mr: 'द्रुत दुवे',
        gu: 'ઝડપી લિંક્સ',
        te: 'త్వరిత లింకులు',
        bn: 'দ্রুত লিঙ্ক',
        ml: 'ദ്രുത ലിങ്കുകൾ',
        pa: 'ਤੁਰੰਤ ਲਿੰਕ',
        or: 'ତ୍ୱରିତ ଲିଙ୍କ୍',
        as: 'দ্ৰুত লিংক',
      },
      'trackOrder': {
        hi: 'ऑर्डर ट्रैक करें',
        kn: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
        ta: 'ஆர்டர் கண்காணிக்கவும்',
        mr: 'ऑर्डर ट्रॅक करा',
        gu: 'ઓર્ડર ટ્રેક કરો',
        te: 'ఆర్డర్ ట్రాక్ చేయండి',
        bn: 'অর্ডার ট্র্যাক করুন',
        ml: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
        pa: 'ਆਰਡਰ ਟ੍ਰੈਕ ਕਰੋ',
        or: 'ଅର୍ଡର ଟ୍ରାକ୍ କରନ୍ତୁ',
        as: 'অৰ্ডাৰ ট্ৰেক কৰক',
      },
      'customerSupport': {
        hi: 'ग्राहक सहायता',
        kn: 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
        ta: 'வாடிக்கையாளர் ஆதரவு',
        mr: 'ग्राहक समर्थन',
        gu: 'ગ્રાહક સપોર્ટ',
        te: 'గ్రాహక మద్దతు',
        bn: 'গ্রাহক সহায়তা',
        ml: 'ഉപഭോക്തൃ പിന്തുണ',
        pa: 'ਗਾਹਕ ਸਹਾਇਤਾ',
        or: 'ଗ୍ରାହକ ସହଯୋଗ',
        as: 'গ্ৰাহক সহায়তা',
      },
      'bulkOrders': {
        hi: 'थोक ऑर्डर',
        kn: 'ಮಾಸ್ಸ್ ಆರ್ಡರ್',
        ta: 'மொத்த ஆர்டர்கள்',
        mr: 'मोठ्या प्रमाणात ऑर्डर',
        gu: 'થોક ઓર્ડર',
        te: 'బల్క్ ఆర్డర్స్',
        bn: 'বাল্ক অর্ডার',
        ml: 'ബൾക്ക് ഓർഡറുകൾ',
        pa: 'ਥੋਕ ਆਰਡਰ',
        or: 'ଥୋକ ଅର୍ଡର',
        as: 'বাল্ক অৰ্ডাৰ',
      },
      'Top Margin Items': {
        hi: 'टॉप मार्जिन आइटम',
        kn: 'ಟಾಪ್ ಮಾರ್ಜಿನ್ ಐಟಂಗಳು',
        ta: 'மேல் வரம்பு பொருட்கள்',
        mr: 'टॉप मार्जिन आयटम',
        gu: 'ટોપ માર્જિન આઇટમ્સ',
        te: 'టాప్ మార్జిన్ ఐటమ్స్',
        bn: 'শীর্ষ মার্জিন আইটেম',
        ml: 'ടോപ്പ് മാർജിൻ ഐറ്റങ്ങൾ',
        pa: 'ਟਾਪ ਮਾਰਜਿਨ ਆਈਟਮ',
        or: 'ଟପ୍ ମାର୍ଜିନ ଆଇଟମ',
        as: 'শীৰ্ষ মাৰ্জিন আইটেম',
      },
      'High-profit food items from different categories': {
        hi: 'विभिन्न श्रेणियों से उच्च लाभ वाले खाद्य पदार्थ',
        kn: 'ವಿಭಿನ್ನ ವರ್ಗಗಳಿಂದ ಹೆಚ್ಚಿನ ಲಾಭದ ಆಹಾರ ವಸ್ತುಗಳು',
        ta: 'பல்வேறு வகைகளிலிருந்து உயர் லாப உணவு பொருட்கள்',
        mr: 'विविध श्रेणींमधून उच्च नफा असलेले अन्न पदार्थ',
        gu: 'વિવિધ શ્રેણીઓમાંથી ઉચ્ચ નફાકારક ખાદ્ય વસ્તુઓ',
        te: 'వివిధ వర్గాల నుండి అధిక లాభాల ఆహార వస్తువులు',
        bn: 'বিভিন্ন বিভাগ থেকে উচ্চ লাভের খাদ্য সামগ্রী',
        ml: 'വിവിധ വിഭാഗങ്ങളിൽ നിന്നുള്ള ഉയർന്ന ലാഭ ഭക്ഷണ വസ്തുക്കൾ',
        pa: 'ਵੱਖ-ਵੱਖ ਸ਼੍ਰੇਣੀਆਂ ਤੋਂ ਉੱਚ ਲਾਭ ਵਾਲੇ ਭੋਜਨ ਆਈਟਮ',
        or: 'ବିଭିନ୍ନ ବର୍ଗରୁ ଉଚ୍ଚ ଲାଭ ଖାଦ୍ୟ ବସ୍ତୁ',
        as: 'বিভিন্ন শ্ৰেণীৰ পৰা উচ্চ লাভৰ খাদ্য সামগ্ৰী',
      },
    };

    const fallback = fallbackTranslations[text]?.[targetLanguage];
    if (fallback) {
      return { translatedText: fallback };
    }

    // If no fallback translation is available, return the original text
    return { translatedText: text };
  }

  public clearCache(): void {
    translationCache.clear();
  }

  public async translateMultipleTexts(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResponse[]> {
    const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
    return Promise.all(promises);
  }
}

export default TranslationService.getInstance(); 