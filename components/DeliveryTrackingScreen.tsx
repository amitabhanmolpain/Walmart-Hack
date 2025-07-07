import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Phone, Truck, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DeliveryTrackingScreenProps {
  address: string;
  phoneNumber: string;
  paymentMethod: string;
  onBackToHome: () => void;
}

export default function DeliveryTrackingScreen({
  address,
  phoneNumber,
  paymentMethod,
  onBackToHome
}: DeliveryTrackingScreenProps) {
  const [truckPosition] = useState(new Animated.Value(0));
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  useEffect(() => {
    // Animate truck moving across the screen
    const animateTruck = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(truckPosition, {
            toValue: width - 100,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(truckPosition, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateTruck();

    // Simulate delivery progress
    const progressInterval = setInterval(() => {
      setDeliveryProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 300); // Update every 300ms for 5 hours simulation

    return () => clearInterval(progressInterval);
  }, []);

  const getDeliveryStatus = () => {
    if (deliveryProgress < 20) return 'Order Confirmed';
    if (deliveryProgress < 40) return 'Preparing Your Order';
    if (deliveryProgress < 60) return 'Out for Delivery';
    if (deliveryProgress < 80) return 'On the Way';
    if (deliveryProgress < 100) return 'Almost There';
    return 'Delivered';
  };

  const getEstimatedTime = () => {
    const remainingProgress = 100 - deliveryProgress;
    const remainingMinutes = Math.floor((remainingProgress / 100) * 300); // 5 hours = 300 minutes
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1565C0', '#2196F3']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <Text style={styles.headerSubtitle}>Your order is on the way!</Text>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Road lines */}
          <View style={styles.roadLine} />
          <View style={[styles.roadLine, { top: '60%' }]} />
          
          {/* Animated truck */}
          <Animated.View
            style={[
              styles.truckContainer,
              {
                transform: [{ translateX: truckPosition }],
              },
            ]}
          >
            <Truck size={40} color="#1565C0" />
            <Text style={styles.truckText}>🚚</Text>
          </Animated.View>

          {/* Delivery destination */}
          <View style={styles.destinationContainer}>
            <MapPin size={32} color="#4CAF50" />
            <Text style={styles.destinationText}>🏠</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Delivery Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${deliveryProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{deliveryProgress}% Complete</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status</Text>
        <Text style={styles.statusText}>{getDeliveryStatus()}</Text>
        <Text style={styles.estimatedTime}>{getEstimatedTime()}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={20} color="#1565C0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoValue}>{address}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Phone size={20} color="#1565C0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Contact Number</Text>
            <Text style={styles.infoValue}>{phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Clock size={20} color="#1565C0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Payment Method</Text>
            <Text style={styles.infoValue}>
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay in 7 Days'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.backToHomeButton} onPress={onBackToHome}>
        <Text style={styles.backToHomeText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  roadLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#666',
    top: '30%',
  },
  truckContainer: {
    position: 'absolute',
    top: '25%',
    alignItems: 'center',
  },
  truckText: {
    fontSize: 24,
    marginTop: 4,
  },
  destinationContainer: {
    position: 'absolute',
    right: 20,
    top: '20%',
    alignItems: 'center',
  },
  destinationText: {
    fontSize: 32,
    marginTop: 4,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  backToHomeButton: {
    backgroundColor: '#1565C0',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backToHomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 