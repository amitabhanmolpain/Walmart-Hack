import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { translations } from '@/constants/languages';
import translationService from '@/services/translationService';
import { getExpiryDate } from '@/app/product/[id]';
import { products } from '@/constants/data';

interface AppContextType {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  outstandingAmount: number;
  addOutstandingAmount: (amount: number) => void;
  clearOutstandingAmount: () => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  showNotification: (message: string) => void;
  hideNotification: () => void;
  notification: {
    visible: boolean;
    message: string;
  };
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
  checkExpiringItems: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const [translatedCache, setTranslatedCache] = useState<Map<string, string>>(new Map());
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      title: 'Welcome to Walmart Viraddhi!',
      message: 'Start exploring our wholesale products and exclusive business benefits.',
      time: '2 hours ago',
      type: 'welcome'
    },
    {
      id: '2',
      title: 'New Bulk Discounts Available',
      message: 'Check out our latest bulk buy offers with up to 20% discount on wholesale orders.',
      time: '1 day ago',
      type: 'offer'
    },
    {
      id: '3',
      title: 'Order Status Update',
      message: 'Your recent order #12345 has been successfully delivered.',
      time: '2 days ago',
      type: 'order'
    }
  ]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    // Add notification for cart addition
    const newNotification = {
      id: Date.now().toString(),
      title: 'Item Added to Cart',
      message: `${product.name} has been added to your cart.`,
      time: 'Just now',
      type: 'cart'
    };
    addNotification(newNotification);
    
    // Show notification in user's selected language
    showNotification(t('itemAddedToCart'));
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    // Show notification in user's selected language
    showNotification(t('itemRemovedFromCart'));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    // Show notification in user's selected language
    showNotification(t('quantityUpdated'));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOutstandingAmount = (amount: number) => {
    setOutstandingAmount(prev => prev + amount);
  };

  const clearOutstandingAmount = () => {
    setOutstandingAmount(0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const t = (key: string): string => {
    return translations[selectedLanguage]?.[key] || translations.en[key] || key;
  };

  const translateText = async (text: string): Promise<string> => {
    // If language is English, return the original text
    if (selectedLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${selectedLanguage}`;
    if (translatedCache.has(cacheKey)) {
      return translatedCache.get(cacheKey)!;
    }

    try {
      const result = await translationService.translateText(text, selectedLanguage, 'en');
      
      // Cache the translation
      setTranslatedCache(prev => new Map(prev).set(cacheKey, result.translatedText));
      
      return result.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  const showNotification = (message: string) => {
    setNotification({ visible: true, message });
  };

  const hideNotification = () => {
    setNotification({ visible: false, message: '' });
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, notification]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Check for expiring items and add notifications
  useEffect(() => {
    checkExpiringItems();
  }, []);
  
  const checkExpiringItems = () => {
    const today = new Date();
    const expiringProducts = [];
    
    // Check all products for expiry dates
    products.forEach(product => {
      const expiryDateStr = getExpiryDate(product.name, product.category);
      const expiryDate = new Date(expiryDateStr);
      
      // Calculate days until expiry
      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // If product expires in 15 days or less, add to expiring items
      if (daysUntilExpiry <= 15 && daysUntilExpiry > 0) {
        const notification = {
          id: `expiry-${product.id}`,
          title: 'Item Expiring Soon',
          message: `${product.name} will expire on ${expiryDateStr}. Consider promoting this item!`,
          time: 'Today',
          type: 'expiry'
        };
        
        // Check if notification already exists
        const notificationExists = notifications.some(n => n.id === notification.id);
        if (!notificationExists) {
          addNotification(notification);
        }
      }
    });
  };
  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        outstandingAmount,
        addOutstandingAmount,
        clearOutstandingAmount,
        t,
        translateText,
        showNotification,
        hideNotification,
        notification,
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};