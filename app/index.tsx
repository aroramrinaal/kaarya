import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation values
  const welcomeTextOpacity = useRef(new Animated.Value(0)).current;
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const appNameTranslateY = useRef(new Animated.Value(50)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    const animationSequence = Animated.sequence([
      // Fade in "Welcome to" text
      Animated.timing(welcomeTextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade in and slide up app name
      Animated.parallel([
        Animated.timing(appNameOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(appNameTranslateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and scale up button
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationSequence.start();
  }, []);

  const handleGetStarted = () => {
    // Use replace instead of push to prevent going back
    router.replace('/main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.View style={{ opacity: welcomeTextOpacity }}>
          <Text style={styles.welcomeText}>Welcome to</Text>
        </Animated.View>
        
        <Animated.View 
          style={{ 
            opacity: appNameOpacity,
            transform: [{ translateY: appNameTranslateY }]
          }}
        >
          <Text style={styles.appName}>Kaarya</Text>
        </Animated.View>
      </View>
      
      <Animated.View 
        style={{ 
          opacity: buttonOpacity,
          transform: [{ scale: buttonScale }]
        }}
      >
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '300', // Light weight
    color: '#8B4513', // Dark brown
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#8B4513', // Dark brown
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#8B4513', // Dark brown background
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#F5F5DC', // Beige text on dark button
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
}); 