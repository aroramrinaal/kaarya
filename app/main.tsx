import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MainProductScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
          'PlayfairDisplay-SemiBold': require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
          'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Error loading fonts:", e);
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    
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
  }, [fontsLoaded]);

  // Commented out for future authentication implementation
  // const handleLogin = () => {
  //   router.push('/auth/login');
  // };

  // const handleSignup = () => {
  //   router.push('/auth/signup');
  // };

  const handleGetStarted = () => {
    // For now, this will just be a placeholder
    // In the future, this will navigate to the actual todo interface
    console.log('Get Started pressed - Todo interface coming soon!');
  };

  if (!fontsLoaded) {
    // Show nothing while fonts load
    return <View style={styles.container} />;
  }

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
            source={require('../assets/images/main/kaarya-stickman.png')} 
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
        
        {/* Main CTA Button - Authentication buttons commented out for now */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.mainButton]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Commented out for future authentication implementation */}
          {/* 
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
          */}
        </View>

        {/* Temporary note for development */}
        <Text style={styles.devNote}>
          🚧 Todo interface coming soon! 🚧
        </Text>
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
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  taglineText: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  descriptionText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.85,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  subtitleText: {
    fontFamily: 'PlayfairDisplay-Regular',
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
    marginBottom: 24,
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
  mainButton: {
    backgroundColor: '#90574D',
  },
  mainButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#FAEBD7',
    letterSpacing: 0.3,
  },
  devNote: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  // Commented out styles for future authentication buttons
  /*
  loginButton: {
    backgroundColor: '#90574D',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#90574D',
  },
  loginButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#FAEBD7',
    letterSpacing: 0.3,
  },
  signupButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#90574D',
    letterSpacing: 0.3,
  },
  */
});