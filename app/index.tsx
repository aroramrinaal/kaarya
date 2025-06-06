import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { onboardingStorage } from '../utils/storage';

// Simple word transitions - no animations, just text cycling
const WORD_VARIANTS = [
  'कार्य',  // Hindi
  'কাজ',   // Bengali
  'काम',   // Nepali
  'Work',  // English
  'Kaarya' // Final word
];

const loadFonts = async () => {
  await Font.loadAsync({
    'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
    'PlayfairDisplay-SemiBold': require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-Black': require('../assets/fonts/PlayfairDisplay-Black.ttf'),
  });
};

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalWord, setShowFinalWord] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check onboarding status and load fonts
  useEffect(() => {
    async function initialize() {
      try {
        // Check if user has seen onboarding
        const hasSeenOnboarding = await onboardingStorage.hasSeenOnboarding();
        
        if (hasSeenOnboarding) {
          // User has seen onboarding, go directly to todo
          router.replace('/todo');
          return;
        }
        
        // User hasn't seen onboarding, load fonts and show welcome screen
        await loadFonts();
        setFontsLoaded(true);
        setIsCheckingOnboarding(false);
      } catch (e) {
        console.warn("Error during initialization:", e);
        // On error, proceed with onboarding
        try {
          await loadFonts();
          setFontsLoaded(true);
        } catch (fontError) {
          console.warn("Error loading fonts:", fontError);
        }
        setIsCheckingOnboarding(false);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || isCheckingOnboarding) return;
    
    const cycleWords = () => {
      if (currentWordIndex < WORD_VARIANTS.length - 1) {
        setTimeout(() => {
          setCurrentWordIndex(prev => prev + 1);
        }, 600); // Quick transitions
      } else {
        setShowFinalWord(true);
      }
    };

    cycleWords();
  }, [currentWordIndex, fontsLoaded, isCheckingOnboarding]);

  const handleNext = () => {
    router.replace('/main');
  };

  if (isCheckingOnboarding || !fontsLoaded) {
    // Show nothing while checking onboarding status or loading fonts
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.mainText}>
          {WORD_VARIANTS[currentWordIndex]}
        </Text>
      </View>

      {showFinalWord && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 64,
    color: '#90574D',
    textAlign: 'center',
    letterSpacing: 2,
  },
  nextButton: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#90574D',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#90574D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#FAEBD7',
    fontWeight: '400',
  },
});