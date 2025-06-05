import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import AppleLogo from '../../assets/logos/apple-logo.svg';
import GoogleLogo from '../../assets/logos/google-logo.svg';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Medium': require('../../assets/fonts/PlayfairDisplay-Medium.ttf'),
          'PlayfairDisplay-SemiBold': require('../../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
          'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Error loading fonts:", e);
      }
    }
    loadFonts();
  }, []);

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

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!fontsLoaded) {
    // Show nothing while fonts load
    return <View style={styles.container} />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
              returnKeyType="done"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={true}
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
              <View style={styles.socialButtonContent}>
                <GoogleLogo width={24} height={24} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              activeOpacity={0.8}
            >
              <View style={styles.socialButtonContent}>
                <AppleLogo width={24} height={24} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </View>
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  content: {
    flex: 1,
    paddingBottom: 220, // More space for larger illustration
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'flex-start',
  },
  formLabel: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 18,
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
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  dividerText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
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
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 15,
    color: '#90574D',
    letterSpacing: 0.3,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  termsText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 11,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 14,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  illustrationImage: {
    width: 320,
    height: 200,
    opacity: 0.6,
  },
});