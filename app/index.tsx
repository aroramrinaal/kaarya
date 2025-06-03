import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Enhanced animation values
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTextOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTextScale = useRef(new Animated.Value(0.8)).current;
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const appNameTranslateY = useRef(new Animated.Value(80)).current;
  const appNameScale = useRef(new Animated.Value(0.7)).current;
  const decorativeLineWidth = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.5)).current;
  const floatingElements = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Create floating background elements animation
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start floating animations
    floatingElements.forEach((element, index) => {
      createFloatingAnimation(element, index * 1000).start();
    });

    // Main entrance animation sequence
    const entranceSequence = Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      
      // Welcome text with subtle bounce
      Animated.parallel([
        Animated.timing(welcomeTextOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(welcomeTextScale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Decorative line expansion
      Animated.timing(decorativeLineWidth, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),

      // App name with dramatic entrance
      Animated.parallel([
        Animated.timing(appNameOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(appNameTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(appNameScale, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      // Button with bounce entrance
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    entranceSequence.start();
  }, []);

  const handleGetStarted = () => {
    // Add exit animation before navigation
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/main');
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
      {/* Floating background elements */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.floatingElement1,
          {
            opacity: floatingElements[0].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
            transform: [
              {
                translateY: floatingElements[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement,
          styles.floatingElement2,
          {
            opacity: floatingElements[1].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.2, 0.1],
            }),
            transform: [
              {
                translateX: floatingElements[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement,
          styles.floatingElement3,
          {
            opacity: floatingElements[2].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.25, 0.1],
            }),
            transform: [
              {
                rotate: floatingElements[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          {/* Welcome text with enhanced styling */}
          <Animated.View
            style={{
              opacity: welcomeTextOpacity,
              transform: [{ scale: welcomeTextScale }],
            }}
          >
            <Text style={styles.welcomeText}>Welcome to</Text>
          </Animated.View>

          {/* Decorative line */}
          <Animated.View
            style={[
              styles.decorativeLine,
              {
                width: decorativeLineWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 60],
                }),
              },
            ]}
          />

          {/* App name with enhanced entrance */}
          <Animated.View
            style={{
              opacity: appNameOpacity,
              transform: [
                { translateY: appNameTranslateY },
                { scale: appNameScale },
              ],
            }}
          >
            <Text style={styles.appName}>Kaarya</Text>
            <View style={styles.appNameUnderline} />
          </Animated.View>

          {/* Subtitle */}
          <Animated.View style={{ opacity: appNameOpacity }}>
            <Text style={styles.subtitle}>Your productivity companion</Text>
          </Animated.View>
        </View>

        {/* Enhanced button */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [
              { translateY: buttonTranslateY },
              { scale: buttonScale },
            ],
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Get Started</Text>
              <View style={styles.buttonAccent} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    opacity: 0.8,
  },
  decorativeLine: {
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: 30,
    opacity: 0.6,
  },
  appName: {
    fontSize: 64,
    fontWeight: '800',
    color: '#8B4513',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: 'rgba(139, 69, 19, 0.2)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  appNameUnderline: {
    width: 120,
    height: 3,
    backgroundColor: '#8B4513',
    alignSelf: 'center',
    opacity: 0.4,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8B4513',
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonText: {
    color: '#F5F5DC',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  buttonAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#F5F5DC',
    opacity: 0.3,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: 50,
  },
  floatingElement1: {
    width: 80,
    height: 80,
    top: height * 0.15,
    left: width * 0.1,
  },
  floatingElement2: {
    width: 60,
    height: 60,
    top: height * 0.7,
    right: width * 0.15,
  },
  floatingElement3: {
    width: 40,
    height: 40,
    top: height * 0.25,
    right: width * 0.25,
  },
});