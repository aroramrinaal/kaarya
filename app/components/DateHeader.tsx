import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      <TouchableOpacity
        accessibilityLabel="Previous day"
        activeOpacity={0.7}
        style={styles.navButton}
        // Placeholder for future behavior
        onPress={() => {}}
      >
        <Text style={[styles.navText, { color: theme.border }]}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.dateText, { color: theme.text }]}>{dateString}</Text>

      <TouchableOpacity
        accessibilityLabel="Next day"
        activeOpacity={0.7}
        style={styles.navButton}
        // Placeholder for future behavior
        onPress={() => {}}
      >
        <Text style={[styles.navText, { color: theme.border }]}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    paddingHorizontal: 32,
    marginBottom: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 20,
    color: '#90574D',
    fontWeight: '600',
    opacity: 0.75,
    flex: 1,
    textAlign: 'center',
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 22,
    fontWeight: '600',
    opacity: 0.85,
  },
});


