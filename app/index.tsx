import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Kaarya</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
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