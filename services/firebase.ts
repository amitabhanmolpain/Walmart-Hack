import { initializeApp } from 'firebase/app';
import { 
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export interface AuthUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
}

export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private auth = auth;

  private constructor() {}

  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  // Email/Password Authentication
  async signUpWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Phone Authentication
  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      // For React Native, we need to use a different approach
      // This is a simplified version - in production, you'd use Firebase Phone Auth properly
      const verificationId = await signInWithPhoneNumber(this.auth, phoneNumber, new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {}
      }, this.auth));
      
      return verificationId.verificationId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async verifyOTP(verificationId: string, otp: string): Promise<AuthUser> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(this.auth, credential);
      return {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber || undefined,
        displayName: userCredential.user.displayName || undefined
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get Current User
  getCurrentUser(): AuthUser | null {
    const user = this.auth.currentUser;
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email || undefined,
      phoneNumber: user.phoneNumber || undefined,
      displayName: user.displayName || undefined
    };
  }

  // Listen to Auth State Changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email || undefined,
          phoneNumber: user.phoneNumber || undefined,
          displayName: user.displayName || undefined
        });
      } else {
        callback(null);
      }
    });
  }
}

// Export singleton instance
export const authService = FirebaseAuthService.getInstance(); 