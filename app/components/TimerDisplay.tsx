import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from 'react-native-svg';

interface TimerDisplayProps {
  isVisible: boolean;
  timeLeft: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClose: () => void;
  progress: number; // 0 to 1
  compact?: boolean; // New prop for compact mode
}

const { width } = Dimensions.get('window');

export default function TimerDisplay({
  isVisible,
  timeLeft,
  isRunning,
  onStart,
  onPause,
  onReset,
  onClose,
  progress,
  compact = false,
}: TimerDisplayProps) {
  // Adjust sizes based on compact mode
  const TIMER_SIZE = compact ? Math.min(width * 0.4, 160) : Math.min(width * 0.6, 240);
  const STROKE_WIDTH = compact ? 6 : 8;
  const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);

  const createCircularProgress = () => {
    return `
      <svg width="${TIMER_SIZE}" height="${TIMER_SIZE}" viewBox="0 0 ${TIMER_SIZE} ${TIMER_SIZE}">
        <!-- Background circle -->
        <circle
          cx="${TIMER_SIZE / 2}"
          cy="${TIMER_SIZE / 2}"
          r="${RADIUS}"
          stroke="#90574D"
          stroke-width="${STROKE_WIDTH}"
          fill="none"
          opacity="0.2"
        />
        <!-- Progress circle -->
        <circle
          cx="${TIMER_SIZE / 2}"
          cy="${TIMER_SIZE / 2}"
          r="${RADIUS}"
          stroke="#90574D"
          stroke-width="${STROKE_WIDTH}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${CIRCUMFERENCE}"
          stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})"
        />
      </svg>
    `;
  };

  const pauseSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" fill="#FAEBD7" rx="1"/>
      <rect x="14" y="4" width="4" height="16" fill="#FAEBD7" rx="1"/>
    </svg>
  `;

  const playSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7z" fill="#FAEBD7"/>
    </svg>
  `;

  const closeSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="#90574D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  if (!isVisible) return null;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
        <SvgXml xml={closeSvg} width="20" height="20" />
      </TouchableOpacity>

      {/* Timer Circle */}
      <View style={[styles.timerContainer, compact && styles.timerContainerCompact]}>
        <SvgXml xml={createCircularProgress()} width={TIMER_SIZE} height={TIMER_SIZE} />
        
        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, compact && styles.timeTextCompact]}>{formatTime(timeLeft)}</Text>
          <Text style={[styles.sessionText, compact && styles.sessionTextCompact]}>Focus Session</Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={[styles.controlsContainer, compact && styles.controlsContainerCompact]}>
        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton, compact && styles.controlButtonCompact]}
          onPress={isRunning ? onPause : onStart}
          activeOpacity={0.8}
        >
          <SvgXml 
            xml={isRunning ? pauseSvg : playSvg} 
            width={compact ? "18" : "24"} 
            height={compact ? "18" : "24"} 
          />
          <Text style={[styles.primaryButtonText, compact && styles.buttonTextCompact]}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton, compact && styles.controlButtonCompact]}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryButtonText, compact && styles.buttonTextCompact]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAEBD7',
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    position: 'relative',
  },
  containerCompact: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  timerContainerCompact: {
    marginBottom: 20,
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 36,
    color: '#90574D',
    fontWeight: '700',
    letterSpacing: -1,
  },
  timeTextCompact: {
    fontSize: 24,
  },
  sessionText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 14,
    color: '#90574D',
    opacity: 0.7,
    marginTop: 4,
  },
  sessionTextCompact: {
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  controlsContainerCompact: {
    gap: 8,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonCompact: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#90574D',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#90574D',
  },
  primaryButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#FAEBD7',
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#90574D',
    fontWeight: '600',
  },
  buttonTextCompact: {
    fontSize: 14,
  },
}); 