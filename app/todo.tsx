import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppFonts } from '../hooks/useAppFonts';
import { useTimer } from '../hooks/useTimer';
import { themes } from '../types';
import { Task, taskStorage } from '../utils/storage';
import AddTaskModal from './components/AddTaskModal';
import DateHeader from './components/DateHeader';
import HeaderBar from './components/HeaderBar';
import TaskItem from './components/TaskItem';
import TimerPanel from './components/TimerPanel';
import ZenMode from './components/ZenMode';


// Header icons and themes moved into components


export default function TodoScreen() {
  const fontsLoaded = useAppFonts();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trashSvg, setTrashSvg] = useState('');
  
  // Timer state - COMMENTED OUT FOR NOW
  // const [isTimerVisible, setIsTimerVisible] = useState(false);
  // const [isZenMode, setIsZenMode] = useState(false);
  // const { timeLeft, isRunning, isCompleted, progress, start, pause, reset } = useTimer();
  
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const currentTheme = themes[isDarkTheme ? 'dark' : 'light'];

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
  }, []);

  // Zen mode handlers - COMMENTED OUT FOR NOW
  // const handleEnterZenMode = useCallback(() => {
  //   setIsZenMode(true);
  // }, []);

  // const handleExitZenMode = useCallback(() => {
  //   setIsZenMode(false);
  // }, []);

  // Theme handlers
  const handleToggleTheme = useCallback(() => {
    setIsDarkTheme(prev => !prev);
  }, []);

  // Optimized render function with keyExtractor
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <TaskItem
      item={item}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
      trashSvg={trashSvg}
      theme={currentTheme}
    />
  ), [handleToggleTask, handleDeleteTask, trashSvg, currentTheme]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  // Show loading state
  if (!fontsLoaded || isLoading) {
    return (
      <View style={[
        styles.container, 
        styles.loadingContainer, 
        { backgroundColor: currentTheme.background }
      ]}>
        <Text style={[styles.loadingText, { color: currentTheme.text }]}>Loading...</Text>
      </View>
    );
  }

  // Zen Mode Render - COMMENTED OUT FOR NOW
  // if (isZenMode) {
  //   return (
  //     <ZenMode
  //       visible={true}
  //       timeLeft={timeLeft}
  //       isRunning={isRunning}
  //       isCompleted={isCompleted}
  //       progress={progress}
  //       onStart={start}
  //       onPause={pause}
  //       onReset={reset}
  //       onExit={handleExitZenMode}
  //     />
  //   );
  // }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={currentTheme.statusBarStyle} backgroundColor={currentTheme.background} />
      
      <HeaderBar
        // isTimerVisible={isTimerVisible}
        // onToggleTimer={() => {
        //   setIsTimerVisible(!isTimerVisible);
        // }}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        theme={currentTheme}
      />

      <DateHeader theme={currentTheme} />

      {/* Timer Panel (compact timer + zen button) - COMMENTED OUT FOR NOW */}
     
     {/* <TimerPanel
       {/*  isVisible={isTimerVisible}
        timeLeft={timeLeft}
        isRunning={isRunning}
        isCompleted={isCompleted}
        progress={progress}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onClose={() => setIsTimerVisible(false)}
        onEnterZen={handleEnterZenMode}
        theme={currentTheme}
      /> */}

      {/* Main Content */}
      {!isLoading && tasks.length === 0 ? (
        <View style={[styles.mainContent]}>
          <Text style={[
            styles.mainMessage, 
            { color: currentTheme.text }
          ]}>
            You don't have any tasks yet. Press + to create your first Kaarya.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.taskList
          ]}
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
        style={[
          styles.addButton, 
          { 
            backgroundColor: currentTheme.border,
            shadowColor: currentTheme.border,
          }
        ]}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.addButtonText, 
          { color: isDarkTheme ? currentTheme.background : '#FAEBD7' }
        ]}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isAddModalVisible}
        theme={currentTheme}
        isDarkTheme={isDarkTheme}
        onClose={handleCloseModal}
        onAdd={async (text) => {
          try {
            const newTask = await taskStorage.addTask(text.trim());
            if (newTask) {
              setTasks(prevTasks => [...prevTasks, newTask]);
            }
          } catch (error) {
            console.error('Error adding task:', error);
          }
        }}
      />
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
  header: undefined as any,
  headerLeft: undefined as any,
  headerRight: undefined as any,
  logoText: undefined as any,
  dateContainer: undefined as any,
  dateText: undefined as any,
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
  swipeableContainer: undefined as any,
  swipeableChildrenContainer: undefined as any,
  taskContainer: undefined as any,
  deleteActionContainer: undefined as any,
  deleteAction: undefined as any,
  deleteButton: undefined as any,
  trashIconContainer: undefined as any,
  fallbackIcon: undefined as any,
  fallbackIconText: undefined as any,
  taskItem: undefined as any,
  checkbox: undefined as any,
  checkboxCompleted: undefined as any,
  checkmark: undefined as any,
  taskText: undefined as any,
  taskTextCompleted: undefined as any,
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
  keyboardAvoidingView: undefined as any,
  modalOverlay: undefined as any,
  modalContent: undefined as any,
  dragIndicator: undefined as any,
  modalTitle: undefined as any,
  taskInput: undefined as any,
  modalButtons: undefined as any,
  modalButton: undefined as any,
  cancelButton: undefined as any,
  cancelButtonText: undefined as any,
  saveButton: undefined as any,
  saveButtonText: undefined as any,
  // Zen Mode Styles moved to components/ZenMode
});