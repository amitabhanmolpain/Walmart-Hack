import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { X, Phone, User } from 'lucide-react-native';
import { authService } from '@/services/firebase';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ visible, onClose, onLoginSuccess }: LoginModalProps) {
  const { t } = useApp();
  const [loading, setLoading] = useState(false);
  
  // Phone OTP fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState('');
  
  // Name input after successful OTP verification
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Generate random 6-digit OTP
  const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handlePhoneAuth = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!otpSent) {
      setLoading(true);
      try {
        // Generate random OTP for any phone number
        const randomOTP = generateRandomOTP();
        setGeneratedOTP(randomOTP);
        setVerificationId('demo-verification-id');
        setOtpSent(true);
        setOtpTimer(60);
        
        // Auto-paste the OTP into the input field
        setOtp(randomOTP);
        
        // Show the generated OTP to the user (in production, this would be sent via SMS)
        Alert.alert(
          'OTP Generated & Auto-filled', 
          `OTP sent to ${phoneNumber}\n\nYour OTP: ${randomOTP}\n\n✅ OTP has been automatically filled in the input field!\n\n(For demo purposes, this OTP is shown here. In production, it would be sent via SMS)`,
          [{ text: 'OK' }]
        );
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp.trim()) {
        Alert.alert('Error', 'Please enter the OTP');
        return;
      }

      setLoading(true);
      try {
        // Verify the entered OTP against the generated OTP
        if (otp === generatedOTP) {
          // Show name input after successful OTP verification
          setShowNameInput(true);
        } else {
          Alert.alert('Error', `Invalid OTP. The correct OTP was: ${generatedOTP}`);
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNameSubmit = () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    // Complete the sign-in process with the user's name
    Alert.alert(
      'Welcome!', 
      `Hello ${userName}! You have been successfully signed in with phone number ${phoneNumber}.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            onLoginSuccess();
          },
        },
      ]
    );
  };

  const resendOTP = () => {
    setOtpSent(false);
    setOtp('');
    setOtpTimer(0);
    setGeneratedOTP('');
  };

  const resetForm = () => {
    setPhoneNumber('');
    setOtp('');
    setOtpSent(false);
    setVerificationId('');
    setOtpTimer(0);
    setGeneratedOTP('');
    setShowNameInput(false);
    setUserName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {showNameInput ? 'Complete Your Profile' : 'Sign In'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {!showNameInput ? (
            // Phone OTP Form
            <View style={styles.form}>
              <View style={styles.authTypeContainer}>
                <Phone size={20} color="#1565C0" />
                <Text style={styles.authTypeText}>Phone Number Authentication</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  editable={!otpSent}
                />
              </View>

              {otpSent && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>OTP (Auto-filled)</Text>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  {otpTimer > 0 ? (
                    <Text style={styles.timerText}>Resend OTP in {otpTimer}s</Text>
                  ) : (
                    <TouchableOpacity onPress={resendOTP}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handlePhoneAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {otpSent ? 'Verify OTP' : 'Send OTP'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Name Input Form
            <View style={styles.form}>
              <View style={styles.authTypeContainer}>
                <User size={20} color="#1565C0" />
                <Text style={styles.authTypeText}>Tell Us About Yourself</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Phone Number: {phoneNumber}
                </Text>
                <Text style={styles.infoSubtext}>
                  Your phone number has been verified successfully!
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, !userName.trim() && styles.submitButtonDisabled]}
                onPress={handleNameSubmit}
                disabled={!userName.trim()}
              >
                <Text style={styles.submitButtonText}>
                  Complete Sign In
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  authTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  authTypeText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  otpInput: {
    backgroundColor: '#f8f9fa',
    borderColor: '#1565C0',
    borderWidth: 2,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#1565C0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  resendText: {
    fontSize: 12,
    color: '#1565C0',
    marginTop: 4,
  },
}); 