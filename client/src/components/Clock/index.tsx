import React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Box, styled } from '@mui/material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const ClockContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  color: 'white',
  textAlign: 'center',
  margin: theme.spacing(2),
}));

const TimeDisplay = styled(Typography)({
  fontSize: '4rem',
  fontWeight: 'bold',
  fontFamily: 'Rubik, sans-serif',
});

const DateDisplay = styled(Typography)({
  fontSize: '1.5rem',
  fontFamily: 'Rubik, sans-serif',
});

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hebrewDate = format(time, "EEEE, d 'ב'MMMM yyyy", { locale: he });

  return (
    <ClockContainer>
      <TimeDisplay>
        {format(time, 'HH:mm:ss')}
      </TimeDisplay>
      <DateDisplay>
        {hebrewDate}
      </DateDisplay>
    </ClockContainer>
  );
} 