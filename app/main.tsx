import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function AuthOptionsScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/main/kaarya.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome to Kaarya</Text>
        
        {/* Tagline */}
        <Text style={styles.taglineText}>All Action. Zero Drama</Text>
        
        {/* Description */}
        <Text style={styles.descriptionText}>
          A distraction-free to-do list built for people who just want to get things done.
        </Text>
        
        <Text style={styles.subtitleText}>
          No badges. No clutter. Just tasks - and a timer if you need it.
        </Text>
        
        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heroImage: {
    width: 290,
    height: 250,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  descriptionText: {
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.85,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.85,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#90574D',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#90574D',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FAEBD7',
    letterSpacing: 0.3,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#90574D',
    letterSpacing: 0.3,
  },
});