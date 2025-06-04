import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailContinue = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Login successful!');
      router.replace('/(authenticated)/dashboard');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.formLabel}>Enter your email to sign up for this app</Text>
        
        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder="name@gmail.com"
          placeholderTextColor="#B8A693"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleEmailContinue}
        />

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          onPress={handleEmailContinue}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Please wait...' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.dividerText}>or</Text>

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

      {/* Bottom Illustration - Fixed at bottom */}
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
    marginBottom: 50,
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
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 22,
  },
  emailInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#90574D',
    borderWidth: 1,
    borderColor: '#E5D5C8',
    marginBottom: 16,
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#90574D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FAEBD7',
    letterSpacing: 0.3,
  },
  dividerText: {
    fontSize: 16,
    color: '#90574D',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  socialButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5D5C8',
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#90574D',
    letterSpacing: 0.2,
  },
  termsText: {
    fontSize: 14,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  illustrationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: -1,
  },
  illustrationImage: {
    width: 300,
    height: 240,
    opacity: 0.7,
  },
});