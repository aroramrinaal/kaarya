import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Multi-language translations of "Work/Task"
const LANGUAGE_VARIANTS = [
  { text: 'Kaarya', lang: 'EN', subtitle: 'Your productivity companion' },
  { text: 'कार्य', lang: 'HI', subtitle: 'आपका उत्पादकता साथी' },
  { text: 'কাজ', lang: 'BN', subtitle: 'আপনার উৎপাদনশীলতার সঙ্গী' },
  { text: 'काम', lang: 'NE', subtitle: 'तपाईंको उत्पादकता साथी' },
  { text: 'Work', lang: 'EN', subtitle: 'Get things done efficiently' },
  { text: 'Travail', lang: 'FR', subtitle: 'Votre compagnon de productivité' },
  { text: '仕事', lang: 'JP', subtitle: 'あなたの生産性パートナー' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  // Core animation values
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const heroTextOpacity = useRef(new Animated.Value(0)).current;
  const heroTextScale = useRef(new Animated.Value(0.3)).current;
  const heroTextRotateX = useRef(new Animated.Value(90)).current;
  const languageIndicatorOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.3)).current;
  
  // Language cycling animation
  const languageTransition = useRef(new Animated.Value(0)).current;
  const glowIntensity = useRef(new Animated.Value(0)).current;
  
  // Floating elements
  const floatingElements = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Particle system
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Quick floating animations
    const createFloatingAnimation = (animValue: Animated.Value, delay: number, duration = 2000) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start floating animations immediately
    floatingElements.forEach((element, index) => {
      createFloatingAnimation(element, index * 200, 1500).start();
    });

    // Particle burst animation
    const createParticleBurst = () => {
      const particleAnimations = particles.map((particle, index) => {
        const angle = (index / particles.length) * 2 * Math.PI;
        const distance = 80 + Math.random() * 40;
        
        return Animated.sequence([
          Animated.delay(index * 50),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: Math.cos(angle) * distance,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: Math.sin(angle) * distance,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.rotate, {
              toValue: 360,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });
      
      return Animated.parallel(particleAnimations);
    };

    // Main entrance sequence - much faster
    const entranceSequence = Animated.sequence([
      // Quick background fade
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Dramatic hero text entrance with 3D effect
      Animated.parallel([
        Animated.spring(heroTextScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(heroTextRotateX, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(heroTextOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Language indicator and subtitle
      Animated.parallel([
        Animated.timing(languageIndicatorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Button with spring entrance
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Start entrance sequence
    entranceSequence.start(() => {
      // Start language cycling after entrance
      startLanguageCycling();
      // Trigger particle burst
      createParticleBurst().start();
    });

    // Glow effect loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowIntensity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowIntensity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startLanguageCycling = () => {
    const cycleLanguages = () => {
      // Animate out current text
      Animated.parallel([
        Animated.timing(languageTransition, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change language
        setCurrentLanguageIndex((prev) => (prev + 1) % LANGUAGE_VARIANTS.length);
        
        // Animate in new text
        Animated.parallel([
          Animated.timing(languageTransition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Schedule next cycle
          setTimeout(cycleLanguages, 2500);
        });
      });
    };

    // Start cycling after initial delay
    setTimeout(cycleLanguages, 3000);
  };

  const handleGetStarted = () => {
    // Quick exit with particle explosion
    Animated.parallel([
      Animated.timing(heroTextScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      ...particles.map(particle => 
        Animated.timing(particle.opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ),
    ]).start(() => {
      router.replace('/main');
    });
  };

  const currentVariant = LANGUAGE_VARIANTS[currentLanguageIndex];

  return (
    <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
      {/* Enhanced floating elements */}
      {floatingElements.map((element, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingElement,
            styles[`floatingElement${index + 1}` as `floatingElement${1|2|3|4}`],
            {
              opacity: element.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.05, 0.2, 0.05],
              }),
              transform: [
                {
                  translateY: element.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, index % 2 === 0 ? -40 : 40],
                  }),
                },
                {
                  rotate: element.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                {
                  scale: element.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.2, 0.8],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Particle system */}
      {particles.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
                {
                  rotate: particle.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <View style={styles.contentContainer}>
        {/* Hero text with language switching */}
        <View style={styles.heroContainer}>
          <Animated.View
            style={[
              styles.heroTextContainer,
              {
                opacity: heroTextOpacity,
                transform: [
                  { scale: heroTextScale },
                  {
                    rotateX: heroTextRotateX.interpolate({
                      inputRange: [0, 90],
                      outputRange: ['0deg', '90deg'],
                    }),
                  },
                  {
                    translateY: languageTransition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.glowContainer,
                {
                  shadowOpacity: glowIntensity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.6],
                  }),
                },
              ]}
            >
              <Text style={styles.heroText}>{currentVariant.text}</Text>
            </Animated.View>
          </Animated.View>

          {/* Language indicator */}
          <Animated.View
            style={[
              styles.languageIndicator,
              { opacity: languageIndicatorOpacity }
            ]}
          >
            <Text style={styles.languageCode}>{currentVariant.lang}</Text>
          </Animated.View>

          {/* Dynamic subtitle */}
          <Animated.View
            style={[
              styles.subtitleContainer,
              { opacity: subtitleOpacity }
            ]}
          >
            <Text style={styles.subtitle}>{currentVariant.subtitle}</Text>
          </Animated.View>
        </View>

        {/* Minimal arrow button */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }],
          }}
        >
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowText}>→</Text>
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
    backgroundColor: '#F5F5DC',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  glowContainer: {
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  heroText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#8B4513',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: 'rgba(139, 69, 19, 0.3)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 12,
  },
  languageIndicator: {
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.2)',
  },
  languageCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    letterSpacing: 1,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8B4513',
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  arrowButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#8B4513',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  arrowText: {
    fontSize: 32,
    color: '#F5F5DC',
    fontWeight: '300',
    textAlign: 'center',
    transform: [{ translateX: 2 }],
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: 50,
  },
  floatingElement1: {
    width: 60,
    height: 60,
    top: height * 0.1,
    left: width * 0.1,
  },
  floatingElement2: {
    width: 40,
    height: 40,
    top: height * 0.8,
    right: width * 0.15,
  },
  floatingElement3: {
    width: 80,
    height: 80,
    top: height * 0.2,
    right: width * 0.1,
  },
  floatingElement4: {
    width: 50,
    height: 50,
    bottom: height * 0.2,
    left: width * 0.2,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#8B4513',
    borderRadius: 4,
    top: height * 0.5,
    left: width * 0.5,
  },
});