import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, Modal } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Plus } from 'lucide-react-native';
import { products, categories } from '@/constants/data';
import TranslatedText from '@/components/TranslatedText';
import { authService } from '@/services/firebase';
import LoginModal from '@/components/LoginModal';

const { width } = Dimensions.get('window');

export default function CategoriesScreen() {
  const { t, addToCart } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.category as string || '');
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [pressedCategory, setPressedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params.category]);

  useEffect(() => {
    if (selectedCategory) {
      // Filter products by selected category
      const filtered = products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setCategoryProducts(filtered);
    }
  }, [selectedCategory]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleProductPress = (product: any) => {
    router.push(`/product/${product.id}`);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCardClean} onPress={() => handleProductPress(item)}>
      <View style={styles.productRowClean}>
        <Image source={{ uri: item.image }} style={styles.productImageClean} />
        <View style={styles.productInfoClean}>
          <Text style={styles.productNameClean} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productWeightClean}>{item.weight || item.description || ''}</Text>
          <View style={styles.priceRowClean}>
            <Text style={styles.priceClean}>₹{item.price}</Text>
            <Text style={styles.mrpClean}>₹{item.mrp}</Text>
            {typeof item.discount === 'number' && item.discount > 0 && (
              <Text style={styles.discountClean}>{Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off</Text>
            )}
          </View>
          {item.margin && (
            <View style={styles.marginBadgeClean}>
              <Text style={styles.marginBadgeTextClean}>Margin: ₹ {(item.mrp - item.price).toFixed(2)} off | {Math.round(((item.mrp - item.price) / item.mrp) * 100)}%</Text>
            </View>
          )}
          {Array.isArray(item.offers) && item.offers.length > 0 && (
            <View style={styles.offerRowClean}>
              {item.offers.map((offer: string, idx: number) => (
                <Text style={styles.offerBadgeClean} key={offer + '_' + idx}>{offer}</Text>
              ))}
            </View>
          )}
          <View style={styles.slabRowClean}>
            <Text style={styles.slabBadgeClean}>Slab prices available</Text>
            {Array.isArray(item.offers) && item.offers.length > 0 && (
              <Text style={styles.offersCountClean}>{item.offers.length} Offers</Text>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.loginButtonClean} onPress={() => handleAddToCart(item)}>
        <Text style={styles.loginButtonTextClean}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Product Detail Modal (same card design, more details)
  const renderProductModal = () => (
    <Modal
      visible={!!selectedProduct}
      animationType="slide"
      transparent
      onRequestClose={() => setSelectedProduct(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedProduct(null)}>
            <Text style={{ fontSize: 22, color: '#333' }}>×</Text>
          </TouchableOpacity>
          {selectedProduct && (
            <>
              <Image source={{ uri: selectedProduct.image }} style={styles.productImageClean} />
              <View style={styles.productInfoClean}>
                <Text style={styles.productNameClean}>{selectedProduct.name}</Text>
                <Text style={styles.productWeightClean}>{selectedProduct.weight || selectedProduct.description || ''}</Text>
                <View style={styles.priceRowClean}>
                  <Text style={styles.priceClean}>₹{selectedProduct.price}</Text>
                  <Text style={styles.mrpClean}>₹{selectedProduct.mrp}</Text>
                  {typeof selectedProduct.discount === 'number' && selectedProduct.discount > 0 && (
                    <Text style={styles.discountClean}>{Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)}% off</Text>
                  )}
                </View>
                {selectedProduct.margin && (
                  <View style={styles.marginBadgeClean}>
                    <Text style={styles.marginBadgeTextClean}>Margin: ₹ {(selectedProduct.mrp - selectedProduct.price).toFixed(2)} off | {Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)}%</Text>
                  </View>
                )}
                {Array.isArray(selectedProduct.offers) && selectedProduct.offers.length > 0 && (
                  <View style={styles.offerRowClean}>
                    {selectedProduct.offers.map((offer: string, idx: number) => (
                      <Text style={styles.offerBadgeClean} key={offer + '_' + idx}>{offer}</Text>
                    ))}
                  </View>
                )}
                <View style={styles.slabRowClean}>
                  <Text style={styles.slabBadgeClean}>Slab prices available</Text>
                  {Array.isArray(selectedProduct.offers) && selectedProduct.offers.length > 0 && (
                    <Text style={styles.offersCountClean}>{selectedProduct.offers.length} Offers</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.loginButtonClean} onPress={() => handleAddToCart(selectedProduct)}>
                  <Text style={styles.loginButtonTextClean}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderCategory = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryCardGrid,
        // Remove right border for rightmost cards
        (index + 1) % 2 === 0 && { borderRightWidth: 0 },
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImageGrid} />
      <Text style={styles.categoryNameGrid} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {selectedCategory ? (
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCategory('')}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Categories'}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/(tabs)/cart')}>
          <ShoppingCart size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Category Info or Grid */}
      {selectedCategory ? (
        <>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{categories.find(c => c.id === selectedCategory)?.name}</Text>
            <Text style={styles.productCount}>{categoryProducts.length} products available</Text>
          </View>
          {categoryProducts.length > 0 ? (
            <FlatList
              data={categoryProducts}
              renderItem={renderProduct}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No products found in this category</Text>
              <Text style={styles.emptyStateSubtext}>Try selecting a different category</Text>
            </View>
          )}
          {renderProductModal()}
        </>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item, index }) => renderCategory({ item, index })}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.categoryGrid}
          showsVerticalScrollIndicator={false}
          style={styles.categoriesFlatList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  cartButton: {
    padding: 8,
  },
  categoryInfo: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCardClean: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  productRowClean: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImageClean: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
  },
  productInfoClean: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  productNameClean: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  productWeightClean: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  priceRowClean: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceClean: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  mrpClean: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountClean: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: 'bold',
  },
  marginBadgeClean: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  marginBadgeTextClean: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  offerRowClean: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  offerBadgeClean: {
    backgroundColor: '#fff',
    borderColor: '#1565C0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  slabRowClean: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slabBadgeClean: {
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
  offersCountClean: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
  },
  loginButtonClean: {
    backgroundColor: '#1565C0',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonTextClean: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartButtonDetailed: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  categoryGrid: {
    padding: 8,
    paddingBottom: 100,
  },
  categoriesFlatList: {
    flex: 1,
  },
  categoryCardGrid: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 2,
    height: 180,
    padding: 0,
  },
  categoryImageGrid: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  categoryNameGrid: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
    padding: 8,
  },
});