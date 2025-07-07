import { Platform } from 'react-native';

export interface GoogleTranslateElementConfig {
  pageLanguage: string;
  includedLanguages?: string;
  layout?: 'SIMPLE' | 'HORIZONTAL' | 'VERTICAL';
  autoDisplay?: boolean;
  multilanguagePage?: boolean;
  gaTrack?: boolean;
  gaId?: string;
}

export class GoogleTranslateElementService {
  private static instance: GoogleTranslateElementService;
  private isInitialized: boolean = false;
  private scriptLoaded: boolean = false;

  private constructor() {}

  public static getInstance(): GoogleTranslateElementService {
    if (!GoogleTranslateElementService.instance) {
      GoogleTranslateElementService.instance = new GoogleTranslateElementService();
    }
    return GoogleTranslateElementService.instance;
  }

  /**
   * Initialize Google Translate Element
   * This method loads the Google Translate script and initializes the widget
   */
  public async initialize(config: Partial<GoogleTranslateElementConfig> = {}): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // For React Native/Expo, we need to handle this differently
    // since we can't directly inject scripts like in web browsers
    if (Platform.OS === 'web') {
      // Ensure pageLanguage is always set
      const finalConfig = { pageLanguage: 'en', ...config };
      await this.initializeForWeb(finalConfig as GoogleTranslateElementConfig);
    } else {
      // For mobile platforms, we'll use a different approach
      console.warn('Google Translate Element is primarily designed for web platforms. Consider using the Google Cloud Translation API for mobile apps.');
    }

    this.isInitialized = true;
  }

  private async initializeForWeb(config: GoogleTranslateElementConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.getElementById('google-translate-script')) {
        this.scriptLoaded = true;
        this.initializeWidget(config);
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;

      // Define the callback function
      (window as any).googleTranslateElementInit = () => {
        this.scriptLoaded = true;
        this.initializeWidget(config);
        resolve();
      };

      // Handle script load error
      script.onerror = () => {
        reject(new Error('Failed to load Google Translate script'));
      };

      // Append script to document
      document.head.appendChild(script);
    });
  }

  private initializeWidget(config: GoogleTranslateElementConfig): void {
    if (!this.scriptLoaded || !(window as any).google?.translate?.TranslateElement) {
      console.error('Google Translate script not loaded');
      return;
    }

    const defaultConfig = {
      pageLanguage: 'en',
      includedLanguages: 'hi,kn,ta,mr,gu,te,bn,ml,pa,or,as',
      layout: 'SIMPLE' as const,
      autoDisplay: false,
      multilanguagePage: false,
      gaTrack: false,
    };

    const finalConfig = { ...defaultConfig, ...config };

    try {
      new (window as any).google.translate.TranslateElement(
        finalConfig,
        'google_translate_element'
      );
    } catch (error) {
      console.error('Failed to initialize Google Translate widget:', error);
    }
  }

  /**
   * Get the current language code
   */
  public getCurrentLanguage(): string {
    if (Platform.OS === 'web' && (window as any).google?.translate?.TranslateElement) {
      try {
        return (window as any).google.translate.TranslateElement.getInstance().getLanguageCode();
      } catch (error) {
        console.error('Failed to get current language:', error);
        return 'en';
      }
    }
    return 'en';
  }

  /**
   * Change the language
   */
  public changeLanguage(languageCode: string): void {
    if (Platform.OS === 'web' && (window as any).google?.translate?.TranslateElement) {
      try {
        (window as any).google.translate.TranslateElement.getInstance().changeLanguage(languageCode);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    }
  }

  /**
   * Restore the original language
   */
  public restore(): void {
    if (Platform.OS === 'web' && (window as any).google?.translate?.TranslateElement) {
      try {
        (window as any).google.translate.TranslateElement.getInstance().restore();
      } catch (error) {
        console.error('Failed to restore language:', error);
      }
    }
  }

  /**
   * Check if the widget is ready
   */
  public isReady(): boolean {
    return this.isInitialized && this.scriptLoaded;
  }

  /**
   * Get the translation widget element
   */
  public getWidgetElement(): HTMLElement | null {
    if (Platform.OS === 'web') {
      return document.getElementById('google_translate_element');
    }
    return null;
  }

  /**
   * Destroy the widget and clean up
   */
  public destroy(): void {
    if (Platform.OS === 'web') {
      const element = document.getElementById('google_translate_element');
      if (element) {
        element.innerHTML = '';
      }
      
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
      
      delete (window as any).googleTranslateElementInit;
    }
    
    this.isInitialized = false;
    this.scriptLoaded = false;
  }
}

export default GoogleTranslateElementService; 