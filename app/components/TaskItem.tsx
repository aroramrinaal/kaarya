import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import type { Task } from '../../utils/storage';
import type { AppTheme } from './types';

type Props = {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  trashSvg: string;
  theme: AppTheme;
};

const TaskItem = React.memo(({ item, onToggle, onDelete, trashSvg, theme }: Props) => {
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
      <View style={[styles.deleteActionContainer, { backgroundColor: theme.deleteBackground }]}>
        <Animated.View 
          style={[styles.deleteAction, { opacity, transform: [{ scale }] }]}
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
                  xml={trashSvg.replace(/fill="[^"]*"/g, `fill="${theme.text}"`).replace(/stroke="[^"]*"/g, `stroke="${theme.text}"`)} 
                  width="22" 
                  height="22" 
                />
              ) : (
                <View style={styles.fallbackIcon}>
                  <Text style={[styles.fallbackIconText, { color: theme.text }]}>🗑</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }, [item.id, onDelete, trashSvg, theme]);

  const handleSwipeOpen = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      setTimeout(() => {
        swipeableRef.current?.close();
      }, 2000);
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
      rightThreshold={30}
      leftThreshold={1000}
      friction={2}
      overshootRight={false}
      overshootLeft={false}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture={true}
      useNativeAnimations={true}
      containerStyle={styles.swipeableContainer}
      childrenContainerStyle={styles.swipeableChildrenContainer}
    >
      <View style={[styles.taskContainer, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={[styles.taskItem, { backgroundColor: theme.cardBackground }]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, { borderColor: theme.border }, item.completed && { backgroundColor: theme.border, borderColor: theme.border }]}>
            {item.completed && <Text style={[styles.checkmark, { color: theme.background }]}>✓</Text>}
          </View>
          <Text style={[styles.taskText, { color: theme.text }, item.completed && styles.taskTextCompleted]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
});

export default TaskItem;

const styles = StyleSheet.create({
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
});


