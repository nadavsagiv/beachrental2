import { useState, useEffect } from 'react';
import { Typography, Box, Alert, Snackbar } from '@mui/material';
import type { Rental } from '../shared/types';

interface TimerProps {
  startTime: string;
  rentalType: 'BED' | 'SUP' | 'SNORKEL';
  duration?: number;
  onTimeWarning?: () => void;
}

const DEFAULT_DURATIONS = {
  BED: 60, // 1 hour in minutes
  SUP: 60, // 1 hour in minutes
  SNORKEL: 120, // 2 hours in minutes
};

const WARNING_THRESHOLD = 10; // minutes

export default function Timer({ startTime, rentalType, duration, onTimeWarning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const durationMs = (duration || DEFAULT_DURATIONS[rentalType]) * 60 * 1000; // convert to milliseconds
      const end = start + durationMs;
      const left = end - now;

      return Math.max(0, Math.floor(left / 1000)); // return seconds left
    };

    const timer = setInterval(() => {
      const secondsLeft = calculateTimeLeft();
      setTimeLeft(secondsLeft);

      // Check for warning threshold
      const minutesLeft = Math.floor(secondsLeft / 60);
      if (minutesLeft <= WARNING_THRESHOLD && minutesLeft > 0 && !showWarning) {
        setShowWarning(true);
        onTimeWarning?.();
      }

      // Check for expiration
      if (secondsLeft === 0 && !isExpired) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, rentalType, duration, onTimeWarning, showWarning, isExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box>
      <Typography variant="h4" component="div" color={minutes < WARNING_THRESHOLD ? 'error' : 'primary'}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
      <Snackbar
        open={showWarning}
        autoHideDuration={6000}
        onClose={() => setShowWarning(false)}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          {minutes} דקות נותרו להשכרה
        </Alert>
      </Snackbar>
    </Box>
  );
} 