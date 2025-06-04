import { Stack } from 'expo-router';
import React from 'react';

export default function AuthenticatedLayout() {
  // TODO: Add authentication check here
  // If user is not authenticated, redirect to auth flow
  
  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          headerShown: false,
          title: 'Dashboard'
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
          title: 'Profile'
        }} 
      />
    </Stack>
  );
} 