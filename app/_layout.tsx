import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="main" options={{ headerShown: false }} />
        {/* Commented out for future authentication implementation */}
        {/* <Stack.Screen name="auth" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="(authenticated)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
