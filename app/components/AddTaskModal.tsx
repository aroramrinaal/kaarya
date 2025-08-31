import React, { useCallback, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { AppTheme } from '../../types';

type Props = {
  visible: boolean;
  theme: AppTheme;
  isDarkTheme: boolean;
  onClose: () => void;
  onAdd: (text: string) => void | Promise<void>;
};

export default function AddTaskModal({ visible, theme, isDarkTheme, onClose, onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSave = useCallback(async () => {
    const content = text.trim();
    if (!content) return;
    await onAdd(content);
    setText('');
    Keyboard.dismiss();
    onClose();
  }, [text, onAdd, onClose]);

  const handleClose = useCallback(() => {
    setText('');
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]} onStartShouldSetResponder={() => true}>
            <View style={[styles.dragIndicator, { backgroundColor: theme.text }]} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Task</Text>
            <TextInput
              style={[styles.taskInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.cardBackground }]}
              placeholder="What needs to be done?"
              placeholderTextColor={`${theme.text}66`}
              value={text}
              onChangeText={setText}
              autoFocus
              multiline
              maxLength={100}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]} onPress={handleClose}>
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.border }]} onPress={handleSave}>
                <Text style={[styles.saveButtonText, { color: isDarkTheme ? theme.background : '#FAEBD7' }]}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});


