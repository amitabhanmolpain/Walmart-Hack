import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Grid3x3 as Grid3X3, ShoppingCart, User, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { t, cart } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.blackBar} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            marginBottom: 16,
            borderRadius: 16,
            marginHorizontal: 18,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#1565C0',
          tabBarInactiveTintColor: '#666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('home'),
            tabBarLabel: t('home'),
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: t('categories'),
            tabBarLabel: t('categories'),
            tabBarIcon: ({ color, size }) => (
              <Grid3X3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="offers"
          options={{
            title: '₹ ' + t('profits'),
            tabBarLabel: '₹ ' + t('profits'),
            tabBarIcon: ({ color, size }) => (
              <TrendingUp size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: t('cart'),
            tabBarLabel: t('cart'),
            tabBarIcon: ({ color, size }) => (
              <View>
                <ShoppingCart size={size} color={color} />
                {cart.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cart.length}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  blackBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    height: 60,
    backgroundColor: '#000',
    zIndex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});