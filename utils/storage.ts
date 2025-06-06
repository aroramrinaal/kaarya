import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'has_seen_onboarding',
  TODAY_TASKS: 'today_tasks', // For future use
};

// Onboarding functions
export const onboardingStorage = {
  // Check if user has seen onboarding
  hasSeenOnboarding: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  // Mark onboarding as completed
  markOnboardingAsSeen: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
    } catch (error) {
      console.error('Error marking onboarding as seen:', error);
    }
  },

  // Reset onboarding (for testing purposes)
  resetOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
};

// Future task storage functions will go here
export const taskStorage = {
  // Placeholder for future task-related storage functions
  // getTodayTasks, saveTodayTasks, etc.
}; 