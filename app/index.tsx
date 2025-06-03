import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Mrinaal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 48,
    fontFamily: 'Cochin', // Use a nice built-in font, or remove this line for default
    color: '#8B4513', // Dark brown for contrast
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
