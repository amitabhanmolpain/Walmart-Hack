import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { products } from '@/constants/data';
import TranslatedText from '../../components/TranslatedText';

function getRandomExpiryDate(productId: string, isFresh = false) {
  // For fresh items, expiry is 3-4 days from now
  const days = isFresh ? (3 + (parseInt(productId.replace(/\D/g, ''), 10) % 2)) : (3 + (parseInt(productId.replace(/\D/g, ''), 10) % 10));
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getContextualDetails(product) {
  const brand = product.brand || 'Unknown';
  const name = product.name || 'Product';
  const category = (product.category || '').toLowerCase();
  const isFresh = /fresh|milk|vegetable|fruit|egg|meat|fish|dairy|bread|moisturizer|shampoo|cream|juice|butter|paneer|curd|yogurt/i.test(name+category);
  const isBulk = Array.isArray(product.includedBrands);
  const isFood = /honey|masala|snack|biscuit|chips|tea|milk|oil|rice|atta|dal|spice|drink|cookie|chocolate|juice|ghee|flour|bread|almond|quinoa|snacks|dairy|butter|moisturizer|shampoo|toothpaste|soap|cream|fruit|vegetable|egg|meat|fish|cereal|nut|seed|jam|pickle|sauce|soup|noodle|pasta|sweet|candy|confectionery|bournvita|bourn vita/i.test(name+category);
  const isVeg = isFood ? !/chicken|meat|fish|egg|non-veg|nonveg|non vegetarian/i.test(name) : undefined;

  // For bulk, generate included brands if not present
  let includedBrands = product.includedBrands;
  if (isBulk && !includedBrands) {
    includedBrands = [
      { brand: 'India Gate', margin: 40, expiry: getRandomExpiryDate(product.id) },
      { brand: 'Daawat', margin: 38, expiry: getRandomExpiryDate(product.id+'2') },
      { brand: 'Fortune', margin: 35, expiry: getRandomExpiryDate(product.id+'3') },
    ];
  }

  // For fresh, short expiry
  const expiryDate = getRandomExpiryDate(product.id, isFresh);

  // About
  let about = '';
  if (isBulk) about = `${name} includes top rice brands like ${includedBrands.map(b => b.brand).join(', ')}. Perfect for bulk buyers.`;
  else if (isFresh) about = `${name} is a fresh product. Please consume before expiry.`;
  else if (isFood) about = `${name} is a high-quality food product, carefully selected for freshness and nutrition.`;
  else about = `${name} is a quality product from ${brand}.`;

  // Highlights
  let highlights = '';
  if (isBulk) highlights = includedBrands.map(b => `Brand: ${b.brand}, Margin: ₹${b.margin}, Expiry: ${b.expiry}`).join('\n');
  else if (isFresh) highlights = `Fresh product. Expiry: ${expiryDate}`;
  else if (isFood) highlights = '1. Fresh and hygienically packed.\n2. High nutritional value.\n3. Sourced from trusted suppliers.';
  else highlights = '1. Quality assured.\n2. Trusted brand.\n3. Customer satisfaction guaranteed.';

  // Description
  let description = product.description || about;

  // Specification
  let specs = [
    { label: 'Brand', value: brand },
    ...(isFood ? [{ label: 'Veg/Non-Veg', value: isVeg ? 'Vegetarian' : 'Non-Vegetarian' }] : []),
    { label: 'Company', value: brand },
    { label: 'Category', value: category },
    { label: 'Expiry Date', value: expiryDate },
    { label: 'Weight', value: product.weight || (isBulk ? 'Multiple' : isFresh ? '1 L' : '1 kg') },
  ];

  return { about, highlights, description, specs, includedBrands, isBulk, isFresh };
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [added, setAdded] = useState(false);
  const product = useMemo(() => products.find(p => p.id === id), [id]);
  if (!product) {
    return <View style={styles.container}><TranslatedText text="Product not found." /></View>;
  }
  const { about, highlights, description, specs, includedBrands, isBulk, isFresh } = getContextualDetails(product);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>By {product.brand?.toUpperCase()}</Text>
        <Text style={styles.productId}>Item No: {product.id.padStart(18, '0')}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>MRP: ₹{product.mrp}</Text>
          <Text style={styles.marginBadge}>Margin: ₹ {(product.mrp - product.price).toFixed(2)} off | {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</Text>
        </View>
        <Text style={styles.slabBadge}>Slab prices available</Text>
        <Text style={styles.expiry}>Expiry Date: {specs.find(s => s.label === 'Expiry Date')?.value}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is this item about?</Text>
        <Text style={styles.sectionText}>{about}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Highlights</Text>
        {isBulk ? (
          includedBrands.map((b, idx) => (
            <View key={idx} style={styles.bulkBrandRow}>
              <Text style={styles.bulkBrandName}>{b.brand}</Text>
              <Text style={styles.bulkBrandDetail}>Margin: ₹{b.margin}</Text>
              <Text style={styles.bulkBrandDetail}>Expiry: {b.expiry}</Text>
            </View>
          ))
        ) : (
          highlights.split('\n').map((line, idx) => (
            <Text key={idx} style={styles.sectionText}>{line}</Text>
          ))
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specification</Text>
        {specs.map((spec, idx) => (
          <Text key={idx} style={styles.specRow}><Text style={styles.specLabel}>{spec.label}:</Text> {spec.value}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal Disclaimer</Text>
        <Text style={styles.sectionText}>Flipkart Wholesale endeavors to ensure the accuracy of the information about the products. However, the actual product packaging and materials may contain more and/or different information. Customers are advised to always check product packaging for warnings, directions, and other information before using or consuming a product.</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => setAdded(true)}>
        <Text style={styles.addToCartText}>{added ? 'Added to Cart' : 'Add to Cart'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 16 },
  productImage: { width: 180, height: 180, resizeMode: 'contain', marginBottom: 12 },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 4 },
  productBrand: { fontSize: 14, color: '#888', marginBottom: 2 },
  productId: { fontSize: 12, color: '#aaa', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' },
  price: { fontSize: 22, fontWeight: 'bold', color: '#222', marginRight: 8 },
  mrp: { fontSize: 16, color: '#888', textDecorationLine: 'line-through', marginRight: 8 },
  marginBadge: { fontSize: 14, color: '#2E7D32', backgroundColor: '#E8F5E8', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  slabBadge: { fontSize: 14, color: '#2E7D32', borderColor: '#2E7D32', borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 8 },
  expiry: { fontSize: 14, color: '#1976d2', marginBottom: 8 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  sectionText: { fontSize: 15, color: '#444', marginBottom: 4 },
  specRow: { fontSize: 15, color: '#444', marginBottom: 2 },
  specLabel: { fontWeight: 'bold', color: '#222' },
  bulkBrandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bulkBrandName: { fontWeight: 'bold', color: '#1976d2', fontSize: 15 },
  bulkBrandDetail: { color: '#444', fontSize: 14, marginLeft: 8 },
  addToCartButton: { backgroundColor: '#1565C0', borderRadius: 8, paddingVertical: 14, alignItems: 'center', margin: 16 },
  addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
}); 