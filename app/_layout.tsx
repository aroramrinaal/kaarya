import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useAppFonts } from '../hooks/useAppFonts';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="todo" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            headerBackVisible: false,
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
