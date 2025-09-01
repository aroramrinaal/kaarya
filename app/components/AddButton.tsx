import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { AppTheme } from '../../types';

type AddButtonProps = {
  onPress: () => void;
  theme: AppTheme;
  isDarkTheme: boolean;
};

export default function AddButton({ onPress, theme, isDarkTheme }: AddButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.addButton,
        {
          backgroundColor: theme.border,
          shadowColor: theme.border,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.addButtonText,
        { color: isDarkTheme ? theme.background : '#FAEBD7' }
      ]}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
