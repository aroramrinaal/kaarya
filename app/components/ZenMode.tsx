import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TimerDisplay from './TimerDisplay';

type ZenModeProps = {
  visible: boolean;
  timeLeft: number;
  isRunning: boolean;
  isCompleted: boolean;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExit: () => void;
};

export default function ZenMode({
  visible,
  timeLeft,
  isRunning,
  isCompleted,
  progress,
  onStart,
  onPause,
  onReset,
  onExit,
}: ZenModeProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity 
      style={styles.zenContainer}
      activeOpacity={1}
      onPress={onExit}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2A1810" />
      <View style={styles.zenContent}>
        <Text style={styles.zenHintText}>Tap anywhere to exit zen mode.</Text>
        <TimerDisplay
          isVisible={true}
          timeLeft={timeLeft}
          isRunning={isRunning}
          isCompleted={isCompleted}
          progress={progress}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          onClose={onExit}
          compact={false}
          zenMode={true}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  zenContainer: {
    flex: 1,
    backgroundColor: '#2A1810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  zenHintText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#D4A574',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});


