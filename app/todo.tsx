import * as Font from 'expo-font';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useTimer } from '../hooks/useTimer';
import { Task, taskStorage } from '../utils/storage';
import TimerDisplay from './components/TimerDisplay';


const getTimerSvg = (isActive: boolean) => `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 13V9M21 6L19 4M10 2H14M12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21Z" stroke="${isActive ? '#FAEBD7' : '#90574D'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const getZenSvg = () => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="#90574D" stroke-width="1.5" fill="none"/>
<circle cx="12" cy="12" r="6" stroke="#90574D" stroke-width="1" fill="none"/>
<circle cx="12" cy="12" r="2" fill="#90574D"/>
</svg>
`;


const TaskItem = React.memo(({ 
  item, 
  onToggle, 
  onDelete, 
  trashSvg 
}: { 
  item: Task; 
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
  trashSvg: string;
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = useCallback((
    progress: Animated.AnimatedAddition<number>, 
    dragX: Animated.AnimatedAddition<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.9, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.deleteActionContainer}>
        <Animated.View 
          style={[
            styles.deleteAction, 
            { 
              opacity, 
              transform: [{ scale }] 
            }
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              swipeableRef.current?.close();
              setTimeout(() => onDelete(item.id), 100);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.trashIconContainer}>
              {trashSvg ? (
                <SvgXml 
                  xml={trashSvg.replace(/fill="[^"]*"/g, `fill="#90574D"`).replace(/stroke="[^"]*"/g, `stroke="#90574D"`)} 
                  width="22" 
                  height="22" 
                />
              ) : (
                <View style={styles.fallbackIcon}>
                  <Text style={styles.fallbackIconText}>🗑</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }, [item.id, onDelete, trashSvg]);

  // Handle swipe open with improved logic
  const handleSwipeOpen = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Auto-close after a shorter delay for better UX
      setTimeout(() => {
        swipeableRef.current?.close();
      }, 2000);
    }
  }, []);

  // Handle swipe will open - prevents getting stuck
  const handleSwipeWillOpen = useCallback((direction: 'left' | 'right') => {
    // This helps prevent the swipe from getting stuck
    if (direction === 'right') {
      // Optional: Add haptic feedback here if needed
    }
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeOpen}
      onSwipeableWillOpen={handleSwipeWillOpen}
      rightThreshold={30} // Adjusted for better control
      leftThreshold={1000} // High value to prevent left swipe
      friction={2} // Increased friction for more control
      overshootRight={false} // Prevent over-swiping
      overshootLeft={false}
      overshootFriction={8} // Helps with bounce-back feel
      enableTrackpadTwoFingerGesture={true}
      useNativeAnimations={true} // Use native animations for better performance
      containerStyle={styles.swipeableContainer}
      childrenContainerStyle={styles.swipeableChildrenContainer}
    >
      <View style={styles.taskContainer}>
        <TouchableOpacity
          style={styles.taskItem}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
});

export default function TodoScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [trashSvg, setTrashSvg] = useState('');
  
  // Timer state
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const { timeLeft, isRunning, isCompleted, progress, start, pause, reset } = useTimer();

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
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    }
    loadFonts();
  }, []);

  // Set current date - memoized to prevent unnecessary recalculations
  const formattedDate = useMemo(() => {
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
    
    return formattedDate.replace(/\d+/, day + suffix);
  }, []);

  useEffect(() => {
    setCurrentDate(formattedDate);
  }, [formattedDate]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Set SVG content directly (fixing the loading issue)
  useEffect(() => {
    // Use inline SVG instead of trying to fetch local assets
    setTrashSvg(`
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke="#90574D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `);
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

  // Optimized handlers with useCallback
  const handleAddTask = useCallback(async () => {
    if (!newTaskText.trim()) return;

    try {
      const newTask = await taskStorage.addTask(newTaskText.trim());
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setNewTaskText('');
        setIsAddModalVisible(false);
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [newTaskText]);

  const handleToggleTask = useCallback(async (taskId: string) => {
    try {
      const success = await taskStorage.toggleTask(taskId);
      if (success) {
        setTasks(prevTasks => 
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      const success = await taskStorage.deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, []);

  // Optimized modal handlers
  const handleOpenModal = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalVisible(false);
    setNewTaskText('');
  }, []);

  // Zen mode handlers
  const handleEnterZenMode = useCallback(() => {
    setIsZenMode(true);
  }, []);

  const handleExitZenMode = useCallback(() => {
    setIsZenMode(false);
  }, []);

  // Optimized render function with keyExtractor
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <TaskItem
      item={item}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
      trashSvg={trashSvg}
    />
  ), [handleToggleTask, handleDeleteTask, trashSvg]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  // Show loading state
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Zen Mode Render
  if (isZenMode) {
    return (
      <TouchableOpacity 
        style={styles.zenContainer}
        activeOpacity={1}
        onPress={handleExitZenMode}
      >
        <StatusBar barStyle="light-content" backgroundColor="#2A1810" />
        <View style={styles.zenContent}>
          <Text style={styles.zenHintText}>Tap anywhere to exit zen mode.</Text>
          <TimerDisplay
            isVisible={true}
            timeLeft={timeLeft}
            isRunning={isRunning}
            isCompleted={isCompleted}
            progress={progress}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onClose={handleExitZenMode}
            compact={false}
            zenMode={true}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAEBD7" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.timerButton, isTimerVisible && styles.timerButtonActive]}
            onPress={() => {
              setIsTimerVisible(!isTimerVisible);
            }}
            activeOpacity={0.7}
          >
            <SvgXml xml={getTimerSvg(isTimerVisible)} width="28" height="28" />
          </TouchableOpacity>
        </View>
        <Text style={styles.logoText}>कार्य</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* Timer Display */}
      <TimerDisplay
        isVisible={isTimerVisible}
        timeLeft={timeLeft}
        isRunning={isRunning}
        isCompleted={isCompleted}
        progress={progress}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onClose={() => setIsTimerVisible(false)}
        compact={true}
        zenMode={false}
      />

      {/* Zen Mode Button */}
      {isTimerVisible && (
        <View style={styles.zenButtonContainer}>
          <TouchableOpacity
            style={styles.zenButton}
            onPress={handleEnterZenMode}
            activeOpacity={0.7}
          >
            <SvgXml xml={getZenSvg()} width="20" height="20" />
            <Text style={styles.zenButtonText}>Zen Mode</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      {!isLoading && tasks.length === 0 ? (
        <View style={[styles.mainContent, isTimerVisible && styles.mainContentWithTimer]}>
          <Text style={[styles.mainMessage, isTimerVisible && styles.mainMessageCompact]}>
            You don't have any tasks yet. Press + to create your first Kaarya.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.taskList,
            isTimerVisible && styles.taskListWithTimer
          ]}
          style={isTimerVisible ? styles.taskListScrollable : undefined}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 68,
            offset: 68 * index,
            index,
          })}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCloseModal}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
             {/* Drag Indicator */}
             <View style={styles.dragIndicator} />
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
                onPress={handleCloseModal}
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
        </KeyboardAvoidingView>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
    color: '#90574D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
  },
  logoText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 40,
    color: '#90574D',
    fontWeight: '700',
  },
  dateContainer: {
    paddingHorizontal: 32,
    marginBottom: 60,
  },
  dateText: {
    fontSize: 20,
    color: '#90574D',
    fontWeight: '600',
    opacity: 0.75,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    marginTop: -80,
  },
  mainContentWithTimer: {
    marginTop: 0,
    paddingHorizontal: 32,
    flex: 0,
    paddingBottom: 160,
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
  mainMessageCompact: {
    fontSize: 24,
    lineHeight: 32,
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
  // Optimized Swipeable Styles
  swipeableContainer: {
    marginHorizontal: 32,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeableChildrenContainer: {
    borderRadius: 12,
  },
  taskContainer: {
    backgroundColor: '#FAEBD7',
    borderRadius: 12,
  },
  deleteActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8D5C4',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  fallbackIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIconText: {
    fontSize: 18,
    color: '#90574D',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAEBD7',
    minHeight: 60,
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
    paddingTop: 16,
    paddingBottom: 120,
  },
  taskListWithTimer: {
    paddingTop: 8,
    paddingBottom: 160,
  },
  taskListScrollable: {
    flexGrow: 0,
    maxHeight: 300, // Limit height to ensure timer and tasks both fit
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAEBD7',
    padding: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#90574D',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: -16,
    marginBottom: 24,
    opacity: 0.3,
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
  timerButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAEBD7',
  },
  timerButtonActive: {
    backgroundColor: '#90574D',
  },
  // Zen Mode Styles
  zenContainer: {
    flex: 1,
    backgroundColor: '#2A1810', // Dark brown background
    justifyContent: 'center',
    alignItems: 'center',
  },
  zenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  zenButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  zenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#90574D',
    borderRadius: 20,
    gap: 8,
  },
  zenButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#90574D',
    fontWeight: '500',
  },
  zenHintText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#D4A574',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});