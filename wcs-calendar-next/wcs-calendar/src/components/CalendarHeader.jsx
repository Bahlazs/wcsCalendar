import React from 'react';
import {
  Box,
  Button,
  Typography,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CalendarHeader = ({
  currentDate,
  onMonthChange,
  calendars,
  selectedCalendars,
  setSelectedCalendars,
  disablePrev,
  disableNext,
}) => {
  const toggleCalendar = (id) => {
    if (selectedCalendars.includes(id)) {
      setSelectedCalendars(selectedCalendars.filter(cid => cid !== id));
    } else {
      setSelectedCalendars([...selectedCalendars, id]);
    }
  };

  return (
    <Stack spacing={2} mb={4}>
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <Button onClick={() => onMonthChange(-1)} disabled={disablePrev}>
          <ArrowBackIcon fontSize="large" />
        </Button>
        <Typography variant="h6">{currentDate.format('YYYY. MMMM')}</Typography>
        <Button onClick={() => onMonthChange(1)} disabled={disableNext}>
          <ArrowForwardIcon fontSize="large" />
        </Button>
      </Stack>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
      >
        {calendars.map((calendar) => {
          const selected = selectedCalendars.includes(calendar.id);
          return (
            <Button
              key={calendar.id}
              onClick={() => toggleCalendar(calendar.id)}
              variant={selected ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              {calendar.name}
            </Button>
          );
        })}
      </Box>
    </Stack>
  );
};

export default CalendarHeader;

