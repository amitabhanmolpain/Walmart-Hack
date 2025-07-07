import React from 'react';
import { Text, TextProps, ActivityIndicator } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslatedTextProps extends TextProps {
  text: string;
  fallbackText?: string;
  showLoadingIndicator?: boolean;
}

export default function TranslatedText({ 
  text, 
  fallbackText, 
  showLoadingIndicator = false,
  style,
  ...props 
}: TranslatedTextProps) {
  const { translatedText, isLoading } = useTranslation(text);

  if (isLoading && showLoadingIndicator) {
    return (
      <Text style={style} {...props}>
        <ActivityIndicator size="small" color="#1565C0" />
        {' '}
        {fallbackText || text}
      </Text>
    );
  }

  return (
    <Text style={style} {...props}>
      {translatedText}
    </Text>
  );
} 