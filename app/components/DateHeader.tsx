import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../../types';

type Props = { theme: AppTheme };

export default function DateHeader({ theme }: Props) {
  const dateString = useMemo(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  }, []);

  return (
    <View style={styles.dateContainer}>
      <Text style={[styles.dateText, { color: theme.text }]}>{dateString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    paddingHorizontal: 32,
    marginBottom: 60,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    color: '#90574D',
    fontWeight: '600',
    opacity: 0.75,
  },
});


