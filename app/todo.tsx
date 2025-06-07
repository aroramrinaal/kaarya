import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Task, taskStorage } from '../utils/storage';

export default function TodoScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const todayTasks = await taskStorage.getTodayTasks();
      setTasks(todayTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;

    const newTask = await taskStorage.addTask(newTaskText.trim());
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setIsAddModalVisible(false);
      Keyboard.dismiss();
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const success = await taskStorage.toggleTask(taskId);
    if (success) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await taskStorage.deleteTask(taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const renderRightActions = (taskId: string) => {
    return (
      <View style={styles.deleteAction}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    );
  };

  const renderTask = ({ item }: { item: Task }) => {
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        onSwipeableOpen={() => handleDeleteTask(item.id)}
        rightThreshold={100}
      >
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() => handleToggleTask(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
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
      {!isLoading && tasks.length === 0 ? (
        <View style={styles.mainContent}>
          <Text style={styles.mainMessage}>
            You don't have any tasks yet. Press + to create your first Kaarya.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TextInput
              style={styles.taskInput}
              placeholder="What needs to be done?"
              placeholderTextColor="#90574D66"
              value={newTaskText}
              onChangeText={setNewTaskText}
              autoFocus
              multiline
              maxLength={100}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddModalVisible(false);
                  setNewTaskText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
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
    fontSize: 36,
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
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  deleteText: {
    fontSize: 16,
    color: '#FAEBD7',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: '#FAEBD7',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#90574D',
    borderRadius: 4,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#90574D',
    borderColor: '#90574D',
  },
  checkmark: {
    fontSize: 14,
    color: '#FAEBD7',
    fontWeight: 'bold',
  },
  taskText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
    color: '#90574D',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskList: {
    paddingHorizontal: 32,
    paddingTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAEBD7',
    padding: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#90574D',
    marginBottom: 24,
  },
  taskInput: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
    color: '#90574D',
    padding: 16,
    borderWidth: 2,
    borderColor: '#90574D',
    borderRadius: 8,
    marginBottom: 8,
    minHeight: 60,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#90574D',
  },
  cancelButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#90574D',
  },
  saveButton: {
    backgroundColor: '#90574D',
  },
  saveButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#FAEBD7',
  },
}); 