import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    Alert.alert('Coming Soon', 'Google sign-in will be available soon!');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Coming Soon', 'Apple sign-in will be available soon!');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create your Kaarya account</Text>
        <Text style={styles.subtitle}>Minimal. Fast. Yours from the first task.</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formLabel}>Choose your preferred sign-in method</Text>
        
        {/* Social Login Buttons */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.socialButtonText}>G Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.socialButtonText}>🍎 Continue with Apple</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By clicking continue, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>

      {/* Bottom Illustration */}
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../../assets/images/login/kaarya-login.png')} 
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 300, // More padding for larger illustration
  },
  formLabel: {
    fontSize: 18,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
    lineHeight: 24,
  },
  socialButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5D5C8',
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#90574D',
    letterSpacing: 0.3,
  },
  termsText: {
    fontSize: 12,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  illustrationImage: {
    width: 360,
    height: 280,
    opacity: 0.7,
  },
});