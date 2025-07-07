import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export const useTranslation = (text: string) => {
  const { selectedLanguage, translateText } = useApp();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (selectedLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translateText(text);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, selectedLanguage, translateText]);

  return { translatedText, isLoading };
};

export const useTranslationArray = (texts: string[]) => {
  const { selectedLanguage, translateText } = useApp();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (selectedLanguage === 'en') {
        setTranslatedTexts(texts);
        return;
      }

      setIsLoading(true);
      try {
        const results = await Promise.all(
          texts.map(text => translateText(text))
        );
        setTranslatedTexts(results);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedTexts(texts);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [texts, selectedLanguage, translateText]);

  return { translatedTexts, isLoading };
}; 