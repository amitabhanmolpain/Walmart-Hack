import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ChartBar as BarChart3, ShoppingCart, Mic, Repeat, PiggyBank } from 'lucide-react-native';
import { brands, products, categories } from '@/constants/data';
import TranslatedText from '@/components/TranslatedText';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Advertisement banner data
const adBanners = [
  {
    id: '1',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹2000',
    image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400',
    backgroundColor: ['#4CAF50', '#66BB6A'],
    icon: '🚚'
  },
  {
    id: '2',
    title: 'Fresh Fruits & Vegetables',
    subtitle: 'Farm fresh daily delivery',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    backgroundColor: ['#FF9800', '#FFB74D'],
    icon: '🥕'
  },
  {
    id: '3',
    title: 'Wide Range of Skin Products',
    subtitle: 'Premium beauty essentials',
    image: 'https://images.pexels.com/photos/3735746/pexels-photo-3735746.jpeg?auto=compress&cs=tinysrgb&w=400',
    backgroundColor: ['#E91E63', '#F06292'],
    icon: '✨'
  },
  {
    id: '4',
    title: 'Baby Care Essentials',
    subtitle: 'Everything for your little one',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400',
    backgroundColor: ['#9C27B0', '#BA68C8'],
    icon: '👶'
  }
];

// Sample bulk buy discount items data
const bulkBuyItems = [
  {
    id: '1',
    name: 'Bulk Rice Purchase',
    originalPrice: '₹2,999',
    offerPrice: '₹2,399',
    discount: '20% off',
    image: 'https://images.pexels.com/photos/1586201375761-83865001e31c?auto=compress&cs=tinysrgb&w=400',
    offerText: 'Min. 50kg order - Bulk discount'
  },
  {
    id: '2',
    name: 'Wholesale Oil Pack',
    originalPrice: '₹1,999',
    offerPrice: '₹1,599',
    discount: '20% off',
    image: 'https://images.pexels.com/photos/1556909114-f6e7ad7d3136?auto=compress&cs=tinysrgb&w=400',
    offerText: 'Min. 20L order - Business rates'
  },
  {
    id: '3',
    name: 'Bulk Snacks Bundle',
    originalPrice: '₹1,499',
    offerPrice: '₹1,199',
    discount: '20% off',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400',
    offerText: 'Min. 100 packs - Restaurant supply'
  },
  {
    id: '4',
    name: 'Bulk Atta Bags',
    originalPrice: '₹3,500',
    offerPrice: '₹2,800',
    discount: '20% off',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    offerText: 'Min. 100kg order - Best for bakeries'
  },
  {
    id: '5',
    name: 'Bulk Dairy Combo',
    originalPrice: '₹2,200',
    offerPrice: '₹1,760',
    discount: '20% off',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    offerText: 'Min. 50L order - Dairy shops only'
  },
  {
    id: '6',
    name: 'Bulk Tea Cartons',
    originalPrice: '₹1,800',
    offerPrice: '₹1,440',
    discount: '20% off',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    offerText: 'Min. 100kg order - Hotels & offices'
  },
  {
    id: '7',
    name: 'Bulk Masala Packs',
    originalPrice: '₹1,200',
    offerPrice: '₹960',
    discount: '20% off',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    offerText: 'Min. 100 packs - Restaurant supply'
  },
  {
    id: '8',
    name: 'Bulk Packaged Foods',
    originalPrice: '₹2,500',
    offerPrice: '₹2,000',
    discount: '20% off',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
    offerText: 'Min. 200 packs - Wholesale only'
  }
];

// Brand logos for Shop by Brands
const brandLogos = [
  { name: 'Coca Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Coca-Cola_logo.svg' },
  { name: 'Unilever', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Unilever_Logo.svg' },
  { name: 'P&G', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Procter_%26_Gamble_logo.svg' },
  { name: 'Nestle', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Nestle_textlogo_blue.svg' },
  { name: 'Reckitt', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Reckitt_Benckiser_logo.svg' },
  { name: 'Colgate', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Colgate-Palmolive_logo.svg' },
  { name: 'ITC', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/ITC_Limited_Logo.svg' },
  { name: 'Britannia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Britannia_Industries_logo.svg' },
];

// Banner ad images for the slideshow
const bannerAds = [
  'https://rukminim2.flixcart.com/fk-p-flap/1688/280/image/6e5b6e2e2e2e2e2e.jpg?q=50', // Flipkart ad
  'https://rukminim2.flixcart.com/fk-p-flap/1688/280/image/2e2e2e2e2e2e2e2e.jpg?q=50', // Flipkart ad
  'https://assets.ajio.com/medias/sys_master/images/images/hb7/hb7/1234567890.jpg', // Ajio ad
  'https://images-static.nykaa.com/uploads/1234567890.jpg', // Nykaa ad
  'https://www.bigbasket.com/media/uploads/banner_images/1234567890.jpg', // BigBasket ad
  'https://www.jiomart.com/images/cms/aw_rbslider/slides/1234567890.jpg', // JioMart ad
];

export default function HomeScreen() {
  const { t, addToCart } = useApp();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [adBannerIndex, setAdBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList<any>>(null);
  const adBannerRef = useRef<FlatList<any>>(null);



  // Get top margin food items from different categories
  const topMarginItems = [
    {
      id: '1',
      name: 'Organic Basmati Rice',
      price: '₹120',
      margin: '30',
      image: 'https://images.pexels.com/photos/1586201375761-83865001e31c?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Pure Ghee',
      price: '₹180',
      margin: '40',
      image: 'https://images.pexels.com/photos/1556909114-f6e7ad7d3136?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Premium Honey',
      price: '₹250',
      margin: '70',
      image: 'https://images.pexels.com/photos/1586201375761-83865001e31c?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Organic Quinoa',
      price: '₹200',
      margin: '80',
      image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '5',
      name: 'Cold Pressed Oil',
      price: '₹150',
      margin: '50',
      image: 'https://images.pexels.com/photos/1556909114-f6e7ad7d3136?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '6',
      name: 'Organic Almonds',
      price: '₹300',
      margin: '100',
      image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '7',
      name: 'Premium Tea',
      price: '₹80',
      margin: '40',
      image: 'https://images.pexels.com/photos/1546173159-83865001e31c?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '8',
      name: 'Organic Spices',
      price: '₹120',
      margin: '60',
      image: 'https://images.pexels.com/photos/1556909114-f6e7ad7d3136?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const topSellingItems = [
    {
      id: '1',
      name: 'Fresh Milk',
      price: '₹60',
      image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Whole Wheat Bread',
      price: '₹35',
      image: 'https://images.pexels.com/photos/144569/pexels-photo-144569.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Fresh Eggs',
      price: '₹120',
      image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Bananas',
      price: '₹40',
      image: 'https://images.pexels.com/photos/47305/bananas-banana-bunch-yellow-47305.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '5',
      name: 'Organic Tomatoes',
      price: '₹80',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '6',
      name: 'Fresh Onions',
      price: '₹30',
      image: 'https://images.pexels.com/photos/144387/pexels-photo-144387.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '7',
      name: 'Green Peas',
      price: '₹90',
      image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '8',
      name: 'Carrots',
      price: '₹50',
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '9',
      name: 'Potatoes',
      price: '₹25',
      image: 'https://images.pexels.com/photos/144387/pexels-photo-144387.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '10',
      name: 'Cucumber',
      price: '₹20',
      image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  // Auto-scroll for banner ads
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerAds.length);
      bannerRef.current?.scrollToIndex({ index: (bannerIndex + 1) % bannerAds.length, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerIndex]);

  // Auto-scroll for advertisement banners
  useEffect(() => {
    const interval = setInterval(() => {
      setAdBannerIndex((prev) => (prev + 1) % adBanners.length);
      adBannerRef.current?.scrollToIndex({ index: (adBannerIndex + 1) % adBanners.length, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [adBannerIndex]);

  // Helper function to safely parse price strings
  const parsePrice = (priceString: string | undefined): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/[₹,]/g, ''));
  };

  const handleItemPress = (item, section) => {
    let price, mrp;
    
    // Handle different item structures based on section
    if (section === 'bulkBuy') {
      price = parsePrice(item.offerPrice);
      mrp = parsePrice(item.originalPrice);
    } else {
      price = parsePrice(item.price);
      mrp = item.mrp ? parsePrice(item.mrp) : price * 1.2;
    }

    // Create a product object that matches our Product interface
    const productData = {
      id: item.id,
      name: item.name,
      price: price,
      mrp: mrp,
      discount: 15, // Default discount
      image: item.image,
      category: section === 'topMargin' ? 'packagedfoods' : 'beverages',
      description: item.weight || '1kg pack',
      brand: 'Premium',
      offers: ['2 Offers'],
      margin: item.margin ? parseFloat(item.margin) : 20,
      inStock: true,
      weight: item.weight || '1kg'
    };
    
    // Navigate to product detail with the product data
    router.push({
      pathname: '/product/[id]',
      params: { 
        id: item.id,
        productData: JSON.stringify(productData)
      }
    });
  };

  const renderBulkBuyItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleItemPress(item, 'bulkBuy')} activeOpacity={1}>
      <View style={styles.bulkBuyCard}>
        <Image source={{ uri: item.image }} style={styles.bulkBuyImage} />
        <View style={styles.bulkBuyContent}>
          <Text style={styles.bulkBuyName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.bulkBuyPriceRow}>
            <Text style={styles.bulkBuyOfferPrice}>{item.offerPrice}</Text>
            <Text style={styles.bulkBuyOriginalPrice}>{item.originalPrice}</Text>
          </View>
          <Text style={styles.bulkBuyDiscount}>{item.discount}</Text>
          <Text style={styles.bulkBuyOfferText}>{item.offerText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const renderTopMarginItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleItemPress(item, 'topMargin')} activeOpacity={1}>
      <View style={styles.topMarginCard}>
        <Image source={{ uri: item.image }} style={styles.topMarginCardImage} />
        <Text style={styles.topMarginCardName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.topMarginCardPriceRow}>
          <Text style={styles.topMarginCardPrice}>{item.price}</Text>
          <Text style={styles.topMarginCardMRP}>MRP: ₹{(parseFloat(item.price.replace('₹', '')) * 1.25).toFixed(0)}</Text>
        </View>
        <View style={styles.marginBadgeGreen}>
          <Text style={styles.marginTextGreen}>₹{item.margin} margin</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButtonSmall} 
          onPress={(e) => {
            e.stopPropagation();
            const productForCart = {
              id: item.id,
              name: item.name,
              price: parsePrice(item.price),
              mrp: parsePrice(item.price) * 1.25,
              discount: 20,
              image: item.image,
              category: 'packagedfoods',
              description: '1kg pack',
              brand: 'Premium',
              offers: ['2 Offers'],
              margin: item.margin ? parseFloat(item.margin) : 20,
              inStock: true
            };
            addToCart(productForCart);
          }}
        >
          <Text style={styles.addToCartTextSmall}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTopSellingItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleItemPress(item, 'topSelling')} activeOpacity={1}>
      <View style={styles.topSellingCard}>
        <Image source={{ uri: item.image }} style={styles.topSellingCardImage} />
        <Text style={styles.topSellingCardName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.topSellingCardPriceRow}>
          <Text style={styles.topSellingCardPrice}>{item.price}</Text>
          <Text style={styles.topSellingCardMRP}>MRP: ₹{(parseFloat(item.price.replace('₹', '')) * 1.15).toFixed(0)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={(e) => {
            e.stopPropagation();
            const productForCart = {
              id: item.id,
              name: item.name,
              price: parsePrice(item.price),
              mrp: parsePrice(item.price) * 1.15,
              discount: 13,
              image: item.image,
              category: 'beverages',
              description: '1L pack',
              brand: 'Fresh',
              offers: ['Best Price'],
              margin: parsePrice(item.price) * 0.15,
              inStock: true
            };
            addToCart(productForCart);
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.categorySlideItem}
      onPress={() => router.push(`/(tabs)/categories?category=${item.name}`)}
    >
      <Image source={{ uri: item.image }} style={styles.categorySlideImage} />
      <Text style={styles.categorySlideName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1565C0', '#2196F3']} style={styles.headerCompact}>
        <View style={styles.headerContentCompact}>
          <View style={styles.logoContainerCompact}>
            <Text style={styles.logoText}>Walmart Viraddhi</Text>
            <Text style={styles.logoSubtext}>Wholesale</Text>
          </View>
          <View style={styles.headerActionsAligned}>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/(tabs)/cart')} activeOpacity={0.7}>
              <ShoppingCart size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainerCompact}>
          <Search size={20} color="#666" />
          <Text style={styles.searchText}>{t('search')}</Text>
          <BarChart3 size={20} color="#1565C0" />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Business Banner */}
        <View style={styles.businessBanner}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.businessImage}
          />
          <View style={styles.businessContent}>
            <TranslatedText text="Own A Business?" style={styles.businessTitle} />
            <TranslatedText text="Unlock exclusive benefits" style={styles.businessSubtitle} />
            <TranslatedText text="Become a member" style={styles.businessCTA} />
          </View>
        </View>

        {/* AI Operations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Operations</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
            <LinearGradient colors={['#42a5f5', '#478ed1']} style={styles.aiCircle}>
              <Mic size={32} color="#fff" />
            </LinearGradient>
            <LinearGradient colors={['#66bb6a', '#43a047']} style={styles.aiCircle}>
              <Repeat size={32} color="#fff" />
            </LinearGradient>
            <LinearGradient colors={['#ffb300', '#ff7043']} style={styles.aiCircle}>
              <PiggyBank size={32} color="#fff" />
            </LinearGradient>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 6 }}>
            <Text style={styles.aiLabel}>Voice Bot</Text>
            <Text style={styles.aiLabel}>AI Reorder</Text>
            <Text style={styles.aiLabel}>Discount Predictor</Text>
          </View>
        </View>

        {/* Advertisement Banner Slideshow */}
        <View style={styles.adBannerSection}>
          <FlatList
            ref={adBannerRef}
            data={adBanners}
            renderItem={({ item }) => (
              <LinearGradient colors={item.backgroundColor} style={styles.adBannerCard}>
                <View style={styles.adBannerContent}>
                  <View style={styles.adBannerText}>
                    <Text style={styles.adBannerIcon}>{item.icon}</Text>
                    <Text style={styles.adBannerTitle}>{item.title}</Text>
                    <Text style={styles.adBannerSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Image source={{ uri: item.image }} style={styles.adBannerImage} />
                </View>
              </LinearGradient>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.adBannerList}
          />
          <View style={styles.adBannerPagination}>
            {adBanners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.adBannerDot,
                  index === adBannerIndex && styles.adBannerDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Banner ad slideshow */}
        <View style={styles.bannerAdSection}>
          <FlatList
            ref={bannerRef}
            data={bannerAds}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.bannerAdImage} resizeMode="cover" />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.bannerAdList}
          />
        </View>

        {/* Bulk Buy Discounts Slideshow */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Bulk Buy Discounts</Text>
          <View style={styles.slideshowContainerFixed}>
            <FlatList
              ref={flatListRef}
              data={bulkBuyItems}
              renderItem={renderBulkBuyItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}
              snapToInterval={296}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              style={styles.slideshow}
              contentContainerStyle={styles.slideshowContent}
            />
            <View style={styles.paginationBelowFixed}>
              {bulkBuyItems.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentSlide && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Shop by Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('shopByBrands')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsContainer}>
            {brandLogos.map((brand, index) => (
              <TouchableOpacity key={index} style={styles.brandCard}>
                <Image
                  source={{ uri: brand.logo }}
                  style={styles.brandImageLogo}
                />
                <Text style={styles.brandName}>{brand.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Margin Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Margin Items</Text>
          <FlatList
            data={topMarginItems}
            renderItem={renderTopMarginItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Top Selling Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          <FlatList
            data={topSellingItems}
            renderItem={renderTopSellingItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Trust Banner */}
        <LinearGradient colors={['#87CEEB', '#4682B4', '#1E90FF']} style={styles.trustBanner}>
          <View style={styles.trustContent}>
            <Text style={styles.trustTitle}>We collect only what is needed</Text>
            <Text style={styles.trustSubtitle}>We don't cheat as we are a reputed company</Text>
            <View style={styles.trustFeatures}>
              <Text style={styles.trustFeature}>✓ Transparent Pricing</Text>
              <Text style={styles.trustFeature}>✓ Quality Guaranteed</Text>
              <Text style={styles.trustFeature}>✓ Trusted by 10,000+ Businesses</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>TRUSTED PARTNER</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCompact: {
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 70,
  },
  headerContentCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainerCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  searchContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 10,
    height: 36,
    marginBottom: 2,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  businessBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  businessImage: {
    width: 120,
    height: 80,
  },
  businessContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
  businessSubtitle: {
    fontSize: 14,
    color: '#1565C0',
    marginTop: 2,
  },
  businessCTA: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginTop: 4,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  brandsContainer: {
    paddingHorizontal: 16,
  },
  brandCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  brandImageLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  pricesBanner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pricesContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    flex: 1,
  },
  pricesProducts: {
    flexDirection: 'row',
  },
  pricesProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 8,
  },
  offersSection: {
    margin: 16,
  },
  slideshowContainerFixed: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  slideshow: {
    flex: 1,
  },
  offerSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: width - 32,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerItemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  offerItemContent: {
    alignItems: 'center',
  },
  offerItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  buyNowButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: '#1565C0',
  },
  trendingBrandCard: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 8,
    width: 80,
    height: 80,
  },
  trendingBrandImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  trendingBrandName: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  headerActionsAligned: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E91E63',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#fff',
    fontSize: 12,
  },
  cartButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinksSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 10,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickLinksTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1565C0',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickLinkButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 2,
  },
  quickLinkText: {
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 13,
  },
  paginationBelowFixed: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 2,
    width: '100%',
  },
  topMarginContainer: {
    paddingHorizontal: 16,
  },
  topMarginContent: {
    paddingVertical: 12,
  },
  topMarginItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    width: 120,
  },
  topMarginItemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 8,
  },
  topMarginItemContent: {
    flex: 1,
  },
  topMarginItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  topMarginPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topMarginPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  topMarginMRP: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  marginBadgeGreen: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  marginTextGreen: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  topMarginScrollView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topMarginCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 120,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topMarginCardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  topMarginCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  topMarginCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topMarginCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  topMarginCardMRP: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  bannerAdSection: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerAdList: {
    flex: 1,
  },
  bannerAdImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  aiCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  aiLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  topSellingItem: {
    // Add appropriate styles for top selling item
  },
  renderTopSellingItem: {
    // Add appropriate render logic for top selling item
  },
  topSellingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topSellingCardImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  topSellingCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  topSellingCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topSellingCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginRight: 4,
  },
  topSellingCardMRP: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#1565C0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addToCartButtonSmall: {
    backgroundColor: '#1565C0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addToCartTextSmall: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bulkBuyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 8,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  slideshowContent: {
    paddingHorizontal: 16,
  },
  bulkBuyImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  bulkBuyContent: {
    padding: 16,
  },
  bulkBuyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bulkBuyPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulkBuyOfferPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginRight: 8,
  },
  bulkBuyOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bulkBuyDiscount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  bulkBuyOfferText: {
    fontSize: 11,
    color: '#666',
  },
  trustBanner: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  trustContent: {
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trustSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  trustFeatures: {
    alignItems: 'center',
    marginBottom: 16,
  },
  trustFeature: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  trustBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trustBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  categorySlideItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categorySlideImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  categorySlideName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  adBannerSection: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  adBannerList: {
    flex: 1,
  },
  adBannerCard: {
    width: width - 32,
    height: 140,
    borderRadius: 16,
  },
  adBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  adBannerText: {
    flex: 1,
  },
  adBannerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  adBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adBannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  adBannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 16,
  },
  adBannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  adBannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  adBannerDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
});