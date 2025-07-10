import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, ShoppingCart, Barcode } from 'lucide-react-native';
import { products } from '@/constants/data';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

// Function to generate random expiry date based on product type
function getExpiryDate(productName: string, category: string) {
  const today = new Date();
  const isFreshProduct = /fresh|milk|dairy|vegetable|fruit|egg|meat|fish|bread|yogurt|curd|paneer/i.test(productName + category);
  const isBeverage = /juice|milk|drink|beverage/i.test(productName + category);
  const isPackaged = /biscuit|snack|chips|noodle|pasta|cereal|oil|ghee|masala|spice|dal|rice|atta/i.test(productName + category);
  
  let daysToAdd = 30; // Default for other products
  
  if (isFreshProduct) {
    daysToAdd = Math.floor(Math.random() * 5) + 2; // 2-6 days
  } else if (isBeverage) {
    daysToAdd = Math.floor(Math.random() * 30) + 15; // 15-45 days
  } else if (isPackaged) {
    daysToAdd = Math.floor(Math.random() * 365) + 180; // 6-18 months
  }
  
  today.setDate(today.getDate() + daysToAdd);
  return today.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Function to determine if product is vegetarian
function getVegStatus(productName: string, category: string) {
  const nonVegItems = /chicken|meat|fish|egg|mutton|beef|pork/i.test(productName);
  return nonVegItems ? 'Non-Vegetarian' : 'Vegetarian';
}

// Function to get product specifications
function getProductSpecs(product: any) {
  const expiryDate = getExpiryDate(product.name, product.category);
  const vegStatus = getVegStatus(product.name, product.category);
  
  return [
    { label: 'Brand', value: product.brand },
    { label: 'Veg/Non-Veg', value: vegStatus },
    { label: 'Country of origin/manufacturer/assembly', value: 'INDIA' },
    { label: 'Flavor', value: product.flavor || 'Original' },
    { label: 'Segment', value: 'All' },
    { label: 'Pack Type', value: product.packType || 'Packet' },
    { label: 'Dietary Need', value: 'Regular' },
    { label: 'Pack Preference', value: 'Each' },
    { label: 'Weight', value: product.weight || product.description },
    { label: 'Expiry Date', value: expiryDate },
  ];
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const specifications = getProductSpecs(product);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const margin = product.mrp - product.price;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Text style={styles.searchPlaceholder}>Search for Products a</Text>
          <Barcode size={20} color="#666" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image Section */}
        <View style={styles.imageSection}>
          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}%</Text>
              <Text style={styles.discountText}>off</Text>
            </View>
          )}

          {/* Offer Badge */}
          {product.offers && product.offers.length > 0 && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>Offer Applicable</Text>
            </View>
          )}

          {/* Wishlist Button */}
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart 
              size={24} 
              color={isWishlisted ? "#ff4444" : "#ccc"} 
              fill={isWishlisted ? "#ff4444" : "none"}
            />
          </TouchableOpacity>

          {/* Product Image */}
          <Image source={{ uri: product.image }} style={styles.productImage} />

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {[1, 2, 3, 4].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>

          {/* Availability Badge */}
          <View style={styles.availabilityBadge}>
            <View style={styles.availabilityDot} />
          </View>
        </View>

        {/* Product Info Section */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandName}>By {product.brand.toUpperCase()}</Text>
          <Text style={styles.itemNumber}>Item No: {product.id.padStart(18, '0')}</Text>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            <Text style={styles.mrp}>MRP: ₹{product.mrp.toFixed(2)}</Text>
            <View style={styles.marginBadge}>
              <Text style={styles.marginText}>
                Margin: ₹ {margin.toFixed(2)} off | {discount}%
              </Text>
            </View>
          </View>

          {/* Slab Prices Badge */}
          <View style={styles.slabBadge}>
            <Text style={styles.slabText}>Slab prices available</Text>
          </View>

          {/* Expiry Date */}
          <Text style={styles.expiryDate}>
            Expiry Date: {specifications.find(spec => spec.label === 'Expiry Date')?.value}
          </Text>
        </View>

        {/* Key Highlights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Highlights</Text>
          <Text style={styles.highlightText}>
            1. {product.name} is a high-quality product enriched with essential nutrients.
          </Text>
          <Text style={styles.highlightText}>
            2. Perfect for daily consumption and provides excellent value for money.
          </Text>
          {product.category === 'beverages' && (
            <Text style={styles.highlightText}>
              3. Rich in vitamins and minerals that help boost energy and immunity.
            </Text>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {product.name} is a premium quality product from {product.brand}. 
            It combines great taste with nutritional benefits, making it perfect for 
            daily consumption. The product is carefully manufactured to ensure 
            freshness and quality.
          </Text>
          <TouchableOpacity>
            <Text style={styles.readMore}>Read More..</Text>
          </TouchableOpacity>
        </View>

        {/* Specification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specification</Text>
          {specifications.map((spec, index) => (
            <View key={index} style={styles.specRow}>
              <Text style={styles.specLabel}>{spec.label}:</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
          <TouchableOpacity>
            <Text style={styles.showLess}>Show Less</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Disclaimer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Flipkart Wholesale endeavors to ensure the accuracy of the information about 
            the products. However, the actual product packaging and materials may contain 
            more and/or different information. Customers are advised to always check 
            product packaging for warnings, directions, and other information before 
            using or consuming a product.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.loginButton} onPress={handleAddToCart}>
          <Text style={styles.loginButtonText}>Login to Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#E53935',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  offerBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 2,
  },
  offerText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  productImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  imageIndicators: {
    flexDirection: 'row',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#1976D2',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  itemNumber: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  mrp: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  marginBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  marginText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  slabBadge: {
    backgroundColor: '#fff',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  slabText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  expiryDate: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  specLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  showLess: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomAction: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  loginButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});