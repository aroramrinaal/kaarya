import { ExtensionStorage } from '@bacons/apple-targets';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useAppFonts } from '../hooks/useAppFonts';
import { themes } from '../types';
import { Task, taskStorage } from '../utils/storage';
import AddButton from './components/AddButton';
import AddTaskModal from './components/AddTaskModal';
import DateHeader from './components/DateHeader';
import HeaderBar from './components/HeaderBar';
import TaskItem from './components/TaskItem';

export default function TodoScreen() {
  const fontsLoaded = useAppFonts();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Deprecated: inline SVG string removed in favor of component-based icon
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Timer state - COMMENTED OUT FOR NOW
  // const [isTimerVisible, setIsTimerVisible] = useState(false);
  // const [isZenMode, setIsZenMode] = useState(false);
  // const { timeLeft, isRunning, isCompleted, progress, start, pause, reset } = useTimer();
  
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const currentTheme = themes[isDarkTheme ? 'dark' : 'light'];

  // Shared storage for widget
  const extensionStorage = new ExtensionStorage('group.aroramrinaal.kaarya');

  const isSameCalendarDay = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const syncWidgetWithTasks = useCallback(
    (date: Date, list: Task[]) => {
      const today = new Date();
      // Only sync today's tasks to the widget
      if (!isSameCalendarDay(date, today)) {
        extensionStorage.set('kaarya_today_tasks', []);
        // No reload to avoid unnecessary updates
        return;
      }

      // Map to a compact shape for the widget
      const widgetTasks = list.map(t => ({ id: t.id, title: t.text, completed: !!t.completed }));
      // Store as JSON string for maximum compatibility with Swift decoder paths
      extensionStorage.set('kaarya_today_tasks', JSON.stringify(widgetTasks) as unknown as string);
      // Reload all widget timelines to ensure refresh
      ExtensionStorage.reloadWidget();
    },
    []
  );

  // Load tasks whenever selected date changes
  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [selectedDate]);

  // No longer needed: SVG string setup removed

  const loadTasksForDate = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateTasks = await taskStorage.getTasksForDate(date);
      setTasks(dateTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep widget in sync whenever tasks or selected date change
  useEffect(() => {
    syncWidgetWithTasks(selectedDate, tasks);
  }, [selectedDate, tasks, syncWidgetWithTasks]);

  // Optimized handlers with useCallback
  const handleToggleTask = useCallback(async (taskId: string) => {
    try {
      const success = await taskStorage.toggleTaskForDate(selectedDate, taskId);
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
  }, [selectedDate]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      const success = await taskStorage.deleteTaskForDate(selectedDate, taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [selectedDate]);

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

  // Date navigation handlers
  const handlePrevDay = useCallback(() => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 1);
      return next;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 1);
      return next;
    });
  }, []);

  // Optimized render function with keyExtractor
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <TaskItem
      item={item}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
      theme={currentTheme}
    />
  ), [handleToggleTask, handleDeleteTask, currentTheme]);

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
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}> 
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

      <DateHeader theme={currentTheme} date={selectedDate} onPrevDay={handlePrevDay} onNextDay={handleNextDay} />

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
      <AddButton
        onPress={handleOpenModal}
        theme={currentTheme}
        isDarkTheme={isDarkTheme}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isAddModalVisible}
        theme={currentTheme}
        isDarkTheme={isDarkTheme}
        onClose={handleCloseModal}
        onAdd={async (text) => {
          try {
            const newTask = await taskStorage.addTaskForDate(selectedDate, text.trim());
            if (newTask) {
              setTasks(prevTasks => [...prevTasks, newTask]);
            }
          } catch (error) {
            console.error('Error adding task:', error);
          }
        }}
      />
    </View>
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