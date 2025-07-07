import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TranslatedText from '@/components/TranslatedText';
import { useApp } from '@/contexts/AppContext';

function getExpiryDate(section) {
  const today = new Date();
  let days = 0;
  if (section === 'topSelling') {
    days = [3, 4, 5][Math.floor(Math.random() * 3)];
  } else {
    days = Math.floor(Math.random() * 10) + 1;
  }
  today.setDate(today.getDate() + days);
  return today.toDateString();
}

export default function ItemDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useApp();
  const { name, image, price, offerPrice, mrp, discount, offerText, section } = params;
  const expiryDate = getExpiryDate(section);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <TranslatedText text={name} style={styles.title} />
      <TranslatedText text="Expiry Date:" style={styles.label} />
      <TranslatedText text={expiryDate} style={styles.value} />
      <TouchableOpacity style={styles.addToCartButton} onPress={() => { addToCart(params); }}>
        <TranslatedText text="Add to Cart" style={styles.addToCartText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  image: { width: 200, height: 200, borderRadius: 16, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, color: '#888', marginBottom: 4 },
  value: { fontSize: 16, marginBottom: 24 },
  addToCartButton: { backgroundColor: '#1565C0', padding: 16, borderRadius: 8, marginTop: 16 },
  addToCartText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 