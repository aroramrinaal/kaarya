import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import TimerDisplay from './TimerDisplay';
import { AppTheme } from './types';

const getZenSvg = () => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="#90574D" stroke-width="1.5" fill="none"/>
  <circle cx="12" cy="12" r="6" stroke="#90574D" stroke-width="1" fill="none"/>
  <circle cx="12" cy="12" r="2" fill="#90574D"/>
</svg>
`;

type TimerPanelProps = {
  isVisible: boolean;
  timeLeft: number;
  isRunning: boolean;
  isCompleted: boolean;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClose: () => void;
  onEnterZen: () => void;
  theme: AppTheme;
};

export default function TimerPanel({
  isVisible,
  timeLeft,
  isRunning,
  isCompleted,
  progress,
  onStart,
  onPause,
  onReset,
  onClose,
  onEnterZen,
  theme,
}: TimerPanelProps) {
  return (
    <View>
      <TimerDisplay
        isVisible={isVisible}
        timeLeft={timeLeft}
        isRunning={isRunning}
        isCompleted={isCompleted}
        progress={progress}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onClose={onClose}
        compact={true}
        zenMode={false}
        theme={theme}
      />

      {isVisible && (
        <View style={styles.zenButtonContainer}>
          <TouchableOpacity
            style={[styles.zenButton, { borderColor: theme.border }]}
            onPress={onEnterZen}
            activeOpacity={0.7}
          >
            <SvgXml xml={getZenSvg()} width="20" height="20" />
            <Text style={[styles.zenButtonText, { color: theme.text }]}>Zen Mode</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});


