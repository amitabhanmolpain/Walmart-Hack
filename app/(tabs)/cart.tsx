import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { Minus, Plus, Trash2, MapPin, Navigation, Phone, Clock, ShoppingCart } from 'lucide-react-native';
import LoginModal from '@/components/LoginModal';
import DeliveryTrackingScreen from '@/components/DeliveryTrackingScreen';
import { LinearGradient } from 'expo-linear-gradient';

export default function CartScreen() {
  const { t, cart, updateQuantity, removeFromCart, getCartTotal, clearCart, addOutstandingAmount } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeliveryScreen, setShowDeliveryScreen] = useState(false);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [paymentOption, setPaymentOption] = useState('cod');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [dummyUpiId, setDummyUpiId] = useState('');
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState('none'); // 'none', 'inway', 'delivered'

  const getCartProfit = () => cart.reduce((sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity, 0);

  const saveOrderProfit = (profit: number, emi: number) => {
    let profitData = [];
    try {
      profitData = JSON.parse(localStorage.getItem('profitData') || '[]');
    } catch {}
    profitData.push({ profit, emi, date: new Date().toISOString() });
    localStorage.setItem('profitData', JSON.stringify(profitData));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your delivery address.');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your phone number for delivery coordination.');
      return;
    }
    const cartTotal = getCartTotal();
    const cartProfit = getCartProfit();
    if (paymentOption === 'emi') {
      setShowPaymentModal(false);
      setPendingOrder({ cartTotal, cartProfit });
      setShowEmiModal(true);
      return;
    }
    // COD order
    finishOrder(cartTotal, cartProfit, 0);
  };

  const finishOrder = (cartTotal: number, cartProfit: number, emi: number) => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const deliveryTimeString = deliveryTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    setEstimatedDeliveryTime(deliveryTimeString);
    setShowPaymentModal(false);
    setShowEmiModal(false);
    setShowDeliveryScreen(true);
    setOrderStatus('inway');
    clearCart();
    saveOrderProfit(cartProfit, emi);
    Alert.alert(
      'Order Placed Successfully!',
      `Your order has been placed. Payment method: ${emi > 0 ? 'EMI' : 'Cash on Delivery'}. Estimated delivery: ${deliveryTimeString}`,
      [{ text: 'OK' }]
    );
  };

  const renderDeliveryScreen = () => (
    <DeliveryTrackingScreen
      address={address}
      phoneNumber={phoneNumber}
      paymentMethod={paymentOption}
      onBackToHome={() => { setShowDeliveryScreen(false); setOrderStatus('delivered'); }}
    />
  );

  if (showDeliveryScreen) {
    return renderDeliveryScreen();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cart')}</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <ShoppingCart size={64} color="#ccc" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some items to get started</Text>
        </View>
      ) : (
        <>
          {/* Place Order Button at Top */}
          <View style={styles.topPlaceOrderContainer}>
            <TouchableOpacity style={styles.topPlaceOrderButton} onPress={handlePlaceOrder}>
              <Text style={styles.topPlaceOrderText}>Place Order - ₹{getCartTotal()}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartItem}>
                  <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
                  <View style={styles.cartItemContent}>
                    <Text style={styles.cartItemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={styles.cartItemPrice}>₹{item.product.price}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus size={16} color="#1565C0" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={16} color="#1565C0" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.cartFooter}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₹{getCartTotal()}</Text>
            </View>
          </View>
        </>
      )}

      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Delivery Address</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your complete address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={[styles.phoneInput, { marginTop: 12 }]}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Text style={{marginTop: 16, fontWeight: 'bold'}}>Select Payment Option</Text>
            <View style={{flexDirection: 'row', marginVertical: 12}}>
              <TouchableOpacity
                style={[styles.paymentOptionButton, paymentOption === 'cod' && styles.paymentOptionSelected]}
                onPress={() => setPaymentOption('cod')}
              >
                <Text style={[styles.paymentOptionText, paymentOption === 'cod' && styles.paymentOptionSelectedText]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>
              {getCartTotal() > 1000 && (
                <TouchableOpacity
                  style={[styles.paymentOptionButton, paymentOption === 'emi' && styles.paymentOptionSelected]}
                  onPress={() => setPaymentOption('emi')}
                >
                  <Text style={[styles.paymentOptionText, paymentOption === 'emi' && styles.paymentOptionSelectedText]}>
                    EMI
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handlePaymentSubmit}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEmiModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Dummy UPI ID for EMI</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter dummy UPI ID"
              value={dummyUpiId}
              onChangeText={setDummyUpiId}
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEmiModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => {
                  if (!dummyUpiId.trim()) {
                    Alert.alert('UPI ID Required', 'Please enter a dummy UPI ID for EMI payment.');
                    return;
                  }
                  if (pendingOrder) {
                    finishOrder(pendingOrder.cartTotal, pendingOrder.cartProfit, Math.round(pendingOrder.cartTotal / 12));
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm EMI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setShowLoginModal(false)}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  mrp: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1565C0',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkoutButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeOrderButton: {
    backgroundColor: '#1565C0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cartList: {
    flex: 1,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  cartFooter: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  deliveryContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  deliveryHeader: {
    padding: 16,
    paddingBottom: 20,
  },
  deliveryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  deliverySubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeMap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
  },
  deliveryInfo: {
    padding: 16,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryTextContainer: {
    marginLeft: 16,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deliveryTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  deliveryAddress: {
    fontSize: 16,
    color: '#666',
  },
  backToHomeButton: {
    backgroundColor: '#1565C0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backToHomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  paymentOptionSelected: {
    backgroundColor: '#1565C0',
  },
  paymentOptionText: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
  paymentOptionSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topPlaceOrderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  topPlaceOrderButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topPlaceOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});