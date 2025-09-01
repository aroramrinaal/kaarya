import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AppTheme } from '../../types';
import type { Task } from '../../utils/storage';
import TrashIcon from './icons/TrashIcon';

type Props = {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  theme: AppTheme;
};

const TaskItem = React.memo(({ item, onToggle, onDelete, theme }: Props) => {
  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  return (
    <View style={[
      styles.taskContainer,
      { backgroundColor: theme.statusBarStyle === 'light-content' ? 'transparent' : theme.cardBackground }
    ]}> 
      <View style={styles.taskItem}> 
        <TouchableOpacity
          style={styles.leftContent}
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
        <TouchableOpacity
          style={styles.trailingDeleteButton}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.trashIconContainer}>
            <TrashIcon size={22} color={theme.border} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 32,
    marginVertical: 4,
    overflow: 'hidden',
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
    backgroundColor: 'transparent',
    minHeight: 60,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 8,
    flex: 1,
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
  trailingDeleteButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    opacity: 0.85,
  },
});


