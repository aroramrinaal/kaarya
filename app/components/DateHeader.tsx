import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from './types';

type Props = { theme: AppTheme };

export default function DateHeader({ theme }: Props) {
  const dateString = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const base = now.toLocaleDateString('en-US', options);
    const day = now.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return base.replace(/\d+/, day + suffix);
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
  },
  dateText: {
    fontSize: 20,
    color: '#90574D',
    fontWeight: '600',
    opacity: 0.75,
  },
});


