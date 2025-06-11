import React, { useEffect, useRef } from 'react';
import {
  Animated,
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
  isCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClose: () => void;
  progress: number; // 0 to 1
  compact?: boolean; // New prop for compact mode
  zenMode?: boolean; // New prop for zen mode
}

const { width } = Dimensions.get('window');

export default function TimerDisplay({
  isVisible,
  timeLeft,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onClose,
  progress,
  compact = false,
  zenMode = false,
}: TimerDisplayProps) {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Adjust sizes based on compact mode and zen mode
  const TIMER_SIZE = zenMode ? Math.min(width * 0.8, 320) : 
                     compact ? Math.min(width * 0.4, 160) : 
                     Math.min(width * 0.6, 240);
  const STROKE_WIDTH = zenMode ? 10 : compact ? 6 : 8;
  const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Completion animation effect
  useEffect(() => {
    if (isCompleted) {
      // Gentle pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 } // Pulse 3 times then stop
      ).start();

      // Fade in completion message
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animations when not completed
      pulseAnim.setValue(1);
      fadeAnim.setValue(0);
    }
  }, [isCompleted, pulseAnim, fadeAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);

  const createCircularProgress = () => {
    const strokeColor = zenMode ? '#D4A574' : '#90574D'; // Lighter brown for zen mode
    const backgroundOpacity = zenMode ? '0.15' : '0.2';
    
    return `
      <svg width="${TIMER_SIZE}" height="${TIMER_SIZE}" viewBox="0 0 ${TIMER_SIZE} ${TIMER_SIZE}">
        <!-- Background circle -->
        <circle
          cx="${TIMER_SIZE / 2}"
          cy="${TIMER_SIZE / 2}"
          r="${RADIUS}"
          stroke="${strokeColor}"
          stroke-width="${STROKE_WIDTH}"
          fill="none"
          opacity="${backgroundOpacity}"
        />
        <!-- Progress circle -->
        <circle
          cx="${TIMER_SIZE / 2}"
          cy="${TIMER_SIZE / 2}"
          r="${RADIUS}"
          stroke="${strokeColor}"
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

  const iconFillColor = zenMode ? '#2A1810' : '#FAEBD7';
  const iconStrokeColor = zenMode ? '#D4A574' : '#90574D';

  const pauseSvg = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="5" height="18" fill="${iconFillColor}" rx="1.5"/>
      <rect x="14" y="3" width="5" height="18" fill="${iconFillColor}" rx="1.5"/>
    </svg>
  `;

  const playSvg = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 4v16l13-8z" fill="${iconFillColor}"/>
    </svg>
  `;

  const closeSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="${iconStrokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  if (!isVisible) return null;

  return (
    <View style={[
      styles.container, 
      compact && styles.containerCompact,
      zenMode && styles.containerZen
    ]}>
      {/* Close button - hidden in zen mode compact view */}
      {!zenMode && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <SvgXml xml={closeSvg} width="20" height="20" />
        </TouchableOpacity>
      )}

      {/* Completion Message - Only in Zen Mode */}
      {isCompleted && zenMode && (
        <Animated.View 
          style={[
            styles.completionContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[
            styles.completionText,
            styles.completionTextZen
          ]}>
            पूर्ण
          </Text>
          <Text style={[
            styles.completionSubtext,
            styles.completionSubtextZen
          ]}>
            Well done! Take a break.
          </Text>
        </Animated.View>
      )}

      {/* Timer Circle */}
      <Animated.View 
        style={[
          styles.timerContainer, 
          compact && styles.timerContainerCompact,
          zenMode && styles.timerContainerZen,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <SvgXml xml={createCircularProgress()} width={TIMER_SIZE} height={TIMER_SIZE} />
        
        {/* Time Display */}
        <View style={[
          styles.timeContainer,
          zenMode && styles.timeContainerZen
        ]}>
          <View style={[
            styles.timeDisplay,
            zenMode && styles.timeDisplayZen
          ]}>
            <Text style={[
              styles.minutesText, 
              compact && styles.minutesTextCompact,
              zenMode && styles.minutesTextZen
            ]}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Control Buttons */}
      <View style={[
        styles.controlsContainer, 
        compact && styles.controlsContainerCompact,
        zenMode && styles.controlsContainerZen
      ]}>
        <TouchableOpacity
          style={[
            styles.controlButton, 
            zenMode ? styles.primaryButtonZen : styles.primaryButton, 
            compact && styles.controlButtonCompact
          ]}
          onPress={isRunning ? onPause : onStart}
          activeOpacity={0.8}
        >
          <SvgXml 
            xml={isRunning ? pauseSvg : playSvg} 
            width={compact ? "22" : "28"} 
            height={compact ? "22" : "28"} 
          />
          <Text style={[
            zenMode ? styles.primaryButtonTextZen : styles.primaryButtonText, 
            compact && styles.buttonTextCompact
          ]}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton, 
            zenMode ? styles.secondaryButtonZen : styles.secondaryButton, 
            compact && styles.controlButtonCompact
          ]}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={[
            zenMode ? styles.secondaryButtonTextZen : styles.secondaryButtonText, 
            compact && styles.buttonTextCompact
          ]}>Reset</Text>
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
  timeDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  minutesText: {
    fontSize: 52,
    color: '#90574D',
    fontWeight: 'bold',
    letterSpacing: 4,
    lineHeight: 56,
  },
  minutesTextCompact: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 2,
    fontWeight: 'bold',
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
    fontSize: 18,
    color: '#FAEBD7',
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#90574D',
    fontWeight: '600',
  },
  buttonTextCompact: {
    fontSize: 16,
  },
  // Zen Mode Styles
  containerZen: {
    backgroundColor: 'transparent',
    paddingVertical: 60,
  },
  timerContainerZen: {
    marginBottom: 60,
  },
  timeContainerZen: {
    width: 280, // Fixed width to prevent text movement
    height: 100, // Adequate height for larger text
  },
  timeDisplayZen: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minutesTextZen: {
    color: '#D4A574',
    fontSize: 56, // Slightly smaller to fit better
    fontWeight: 'bold',
    letterSpacing: 4,
    lineHeight: 64,
    textAlign: 'center',
    width: '100%', // Take full width of container
    includeFontPadding: false, // Remove extra padding on Android
  },
  controlsContainerZen: {
    gap: 20,
    maxWidth: 360,
  },
  primaryButtonZen: {
    backgroundColor: '#D4A574',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonTextZen: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#2A1810',
    fontWeight: '600',
  },
  secondaryButtonZen: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  secondaryButtonTextZen: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    color: '#D4A574',
    fontWeight: '600',
  },
  // Completion Animation Styles
  completionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  completionText: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#90574D',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  completionTextZen: {
    color: '#D4A574',
    fontSize: 28,
  },
  completionSubtext: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    color: '#90574D',
    textAlign: 'center',
    opacity: 0.8,
  },
  completionSubtextZen: {
    color: '#D4A574',
    opacity: 0.9,
  },
}); 