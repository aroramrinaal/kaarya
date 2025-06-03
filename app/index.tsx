import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Simple word transitions - no animations, just text cycling
const WORD_VARIANTS = [
  'कार्य',  // Hindi
  'কাজ',   // Bengali
  'काम',   // Nepali
  'Work',  // English
  'Kaarya' // Final word
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalWord, setShowFinalWord] = useState(false);

  useEffect(() => {
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
  }, [currentWordIndex]);

  const handleNext = () => {
    router.replace('/main');
  };

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
    fontSize: 64,
    fontWeight: '700',
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