import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleEmailContinue = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    Alert.alert('Coming Soon', 'Email signup will be available soon!');
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
      {/* Main Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create your Kaarya account</Text>
          <Text style={styles.subtitle}>Minimal. Fast. Yours from the first task.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Section */}
          <Text style={styles.formLabel}>Enter your email to sign up for this app</Text>
          
          <TextInput
            style={styles.emailInput}
            placeholder="name@gmail.com"
            placeholderTextColor="#90574D80"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleEmailContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
      </View>

      {/* Bottom Illustration - Fixed Position */}
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
  content: {
    flex: 1,
    paddingBottom: 180, // Space for illustration
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    marginBottom: 40,
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
    justifyContent: 'flex-start',
  },
  formLabel: {
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 20,
  },
  emailInput: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#90574D',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5D5C8',
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButton: {
    height: 56,
    backgroundColor: '#90574D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  dividerText: {
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 24,
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
    bottom: 20,
    left: 0,
    right: 0,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  illustrationImage: {
    width: 280,
    height: 160,
    opacity: 0.6,
  },
});