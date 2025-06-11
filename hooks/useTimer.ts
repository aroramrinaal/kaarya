import { useCallback, useEffect, useRef, useState } from 'react';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  progress: number; // 0 to 1
}

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate progress (0 to 1, where 1 is complete)
  const progress = (POMODORO_DURATION - timeLeft) / POMODORO_DURATION;

  // Timer tick function
  const tick = useCallback(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        setIsRunning(false);
        setIsCompleted(true);
        // Timer completed - could add notification/vibration here
        return 0;
      }
      return prevTime - 1;
    });
  }, []);

  // Start the timer
  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(POMODORO_DURATION);
  }, []);

  // Effect to handle the timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // Cleanup when component unmounts or timer is not running
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isRunning,
    isCompleted,
    progress,
    start,
    pause,
    reset,
  };
} 