import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace('/main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Kaarya!</Text>
        <Text style={styles.descriptionText}>
          Your productivity app is ready to go.
        </Text>
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#90574D',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#90574D',
    borderRadius: 16,
  },
  logoutText: {
    color: '#FAEBD7',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 18,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
}); 