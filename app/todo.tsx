import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TodoScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
          'PlayfairDisplay-SemiBold': require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
          'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
          'PlayfairDisplay-Black': require('../assets/fonts/PlayfairDisplay-Black.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Error loading fonts:", e);
      }
    }
    loadFonts();
  }, []);

  // Set current date
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    // Add ordinal suffix to day
    const day = now.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    const finalDate = formattedDate.replace(/\d+/, day + suffix);
    setCurrentDate(finalDate);
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAEBD7" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>कार्य</Text>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.mainMessage}>
          You don't have any tasks yet. Press + to create your first Kaarya.
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
  },
  logoText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#90574D',
    fontWeight: '700',
  },
  menuButton: {
    padding: 12,
  },
  menuDots: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#90574D',
    marginVertical: 2.5,
  },
  dateContainer: {
    paddingHorizontal: 32,
    marginBottom: 60,
  },
  dateText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#90574D',
    fontStyle: 'italic',
    opacity: 0.75,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    marginTop: -80,
  },
  mainMessage: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 34,
    color: '#90574D',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.8,
    maxWidth: 320,
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#90574D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#90574D',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 36,
    color: '#FAEBD7',
    fontWeight: '200',
    lineHeight: 36,
    marginTop: -2,
  },
}); 