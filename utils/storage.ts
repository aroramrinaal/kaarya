import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'has_seen_onboarding',
  TODAY_TASKS: 'today_tasks', // For future use
};

// Task interface
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Helper function to get today's date key
const getTodayKey = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `tasks_${year}-${month}-${day}`;
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

// Task storage functions
export const taskStorage = {
  // Get today's tasks
  getTodayTasks: async (): Promise<Task[]> => {
    try {
      const todayKey = getTodayKey();
      const tasksJson = await AsyncStorage.getItem(todayKey);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting today tasks:', error);
      return [];
    }
  },

  // Save today's tasks
  saveTodayTasks: async (tasks: Task[]): Promise<void> => {
    try {
      const todayKey = getTodayKey();
      await AsyncStorage.setItem(todayKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving today tasks:', error);
    }
  },

  // Add a new task
  addTask: async (taskText: string): Promise<Task | null> => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const currentTasks = await taskStorage.getTodayTasks();
      const updatedTasks = [...currentTasks, newTask];
      await taskStorage.saveTodayTasks(updatedTasks);
      
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  },

  // Toggle task completion
  toggleTask: async (taskId: string): Promise<boolean> => {
    try {
      const currentTasks = await taskStorage.getTodayTasks();
      const updatedTasks = currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      await taskStorage.saveTodayTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error toggling task:', error);
      return false;
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<boolean> => {
    try {
      const currentTasks = await taskStorage.getTodayTasks();
      const updatedTasks = currentTasks.filter(task => task.id !== taskId);
      await taskStorage.saveTodayTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Clear all tasks for today (optional utility)
  clearTodayTasks: async (): Promise<void> => {
    try {
      const todayKey = getTodayKey();
      await AsyncStorage.removeItem(todayKey);
    } catch (error) {
      console.error('Error clearing today tasks:', error);
    }
  },

  // Get tasks for a specific date (for future use)
  getTasksForDate: async (date: Date): Promise<Task[]> => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `tasks_${year}-${month}-${day}`;
      
      const tasksJson = await AsyncStorage.getItem(dateKey);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks for date:', error);
      return [];
    }
  },
}; 