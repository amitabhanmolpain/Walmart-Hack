import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { products, categories } from '@/constants/data';
import { ChevronLeft, Search, SlidersHorizontal, Heart, Star, TrendingUp } from 'lucide-react-native';
import TranslatedText from '@/components/TranslatedText';

const { width } = Dimensions.get('window');

export default function ProductsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { t, addToCart, selectedLanguage } = useApp();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const categoryData = categories.find(cat => cat.id === category);
  const categoryProducts = products.filter(product => product.category === category);

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') return categoryProducts;
    return categoryProducts.filter(product => {
      // Check if product name or description contains the subcategory
      const productText = `${product.name} ${product.description}`.toLowerCase();
      return productText.includes(selectedFilter.toLowerCase());
    });
  }, [categoryProducts, selectedFilter]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const getSubcategories = () => {
    return categoryData?.subcategories || [];
  };

  const getCategoryTitle = () => {
    if (selectedLanguage === 'en') {
      return categoryData?.name || 'Products';
    }
    // Return translated category name
    return t(category || 'products') || categoryData?.name || 'Products';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {getCategoryTitle()}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Subcategory Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersContainerBlue}
        contentContainerStyle={styles.filtersContentBlue}
      >
        <TouchableOpacity
          style={[
            styles.filterButtonBlue,
            selectedFilter === 'all' && styles.filterButtonBlueActive
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterButtonBlueText,
            selectedFilter === 'all' && styles.filterButtonBlueTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {getSubcategories().map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButtonBlue,
              selectedFilter === subcategory && styles.filterButtonBlueActive
            ]}
            onPress={() => setSelectedFilter(subcategory)}
          >
            <Text style={[
              styles.filterButtonBlueText,
              selectedFilter === subcategory && styles.filterButtonBlueTextActive
            ]}>
              {subcategory}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {t('showingResults')}: {filteredProducts.length}
        </Text>
        <TouchableOpacity style={styles.filterToggle}>
          <SlidersHorizontal size={20} color="#1565C0" />
          <Text style={styles.filterToggleText}>{t('filter')} ▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {/* Discount Badge */}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% off</Text>
              </View>
            )}
            {/* Offer Badge */}
            {product.offers && product.offers.length > 0 && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>Offer Applicable</Text>
              </View>
            )}
            <View style={styles.productContent}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                {product.weight && (
                  <Text style={styles.productWeight}>{product.weight}</Text>
                )}
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{product.price}</Text>
                  <Text style={styles.mrp}>MRP: ₹{product.mrp}</Text>
                </View>
                <View style={styles.marginRow}>
                  <Text style={styles.marginBadge}>Margin: ₹ {product.margin} off | {product.discount}%</Text>
                </View>
                {/* Flavour/Variant Tags */}
                {product.variants && product.variants.length > 0 && (
                  <View style={styles.variantRow}>
                    {product.variants.map((variant: string, idx: number) => (
                      <View key={idx} style={[styles.variantTag, variant === product.selectedVariant && styles.variantTagActive]}>
                        <Text style={[styles.variantTagText, variant === product.selectedVariant && styles.variantTagTextActive]}>{variant}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {/* Slab Prices Badge */}
                <View style={styles.slabBadgeRow}>
                  <Text style={styles.slabBadge}>Slab prices available</Text>
                  {product.offers && product.offers.length > 0 && (
                    <TouchableOpacity style={styles.offersRow}>
                      <Text style={styles.offersCount}>{product.offers.length} Offers</Text>
                      <Text style={styles.offersArrow}>▼</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {/* Login to Buy Button */}
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login to Buy</Text>
                </TouchableOpacity>
              </View>
              {/* Wishlist Heart Icon */}
              <TouchableOpacity style={styles.heartButton}>
                <Heart size={22} color="#ccc" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Additional Content When Scrolling Down */}
        <View style={styles.additionalContent}>
          <View style={styles.trendingSection}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#1565C0" />
              <Text style={styles.sectionTitle}>Trending in {getCategoryTitle()}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
              {categoryProducts.slice(0, 5).map((product) => (
                <TouchableOpacity key={product.id} style={styles.trendingCard}>
                  <Image source={{ uri: product.image }} style={styles.trendingImage} />
                  <Text style={styles.trendingName}>{product.name}</Text>
                  <Text style={styles.trendingPrice}>₹{product.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.recommendationsSection}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Recommended for You</Text>
            </View>
            <View style={styles.recommendationsGrid}>
              {categoryProducts.slice(0, 4).map((product) => (
                <TouchableOpacity key={product.id} style={styles.recommendationCard}>
                  <Image source={{ uri: product.image }} style={styles.recommendationImage} />
                  <Text style={styles.recommendationName}>{product.name}</Text>
                  <Text style={styles.recommendationPrice}>₹{product.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    padding: 8,
  },
  filtersContainerBlue: {
    backgroundColor: '#1565C0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  filtersContentBlue: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  filterButtonBlue: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#1565C0',
  },
  filterButtonBlueActive: {
    backgroundColor: '#fff',
    borderColor: '#1565C0',
  },
  filterButtonBlueText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  filterButtonBlueTextActive: {
    color: '#1565C0',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
  },
  filterToggleText: {
    color: '#1565C0',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E53935',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 2,
  },
  offerText: {
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '600',
  },
  productContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    paddingBottom: 0,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
    position: 'relative',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  productWeight: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  mrp: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  marginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  marginBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  variantTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#1565C0',
    backgroundColor: '#fff',
  },
  variantTagActive: {
    backgroundColor: '#1565C0',
  },
  variantTagText: {
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '600',
  },
  variantTagTextActive: {
    color: '#fff',
  },
  slabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slabBadge: {
    backgroundColor: '#fff',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 10,
  },
  offersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  offersCount: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
    marginRight: 2,
  },
  offersArrow: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#1565C0',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  additionalContent: {
    padding: 16,
  },
  trendingSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  trendingScroll: {
    padding: 8,
  },
  trendingCard: {
    marginRight: 16,
  },
  trendingImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  trendingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  trendingPrice: {
    fontSize: 12,
    color: '#666',
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationCard: {
    width: '48%',
    marginRight: 4,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  recommendationPrice: {
    fontSize: 12,
    color: '#666',
  },
});