import React from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';

const CalendarHeader = ({
  currentDate,
  onMonthChange,
  calendars,
  selectedCalendar,
  setSelectedCalendar,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} width="80%">
        <Button onClick={() => onMonthChange(-1)}>Előző hónap</Button>
        <Typography variant="h6">{currentDate.format('YYYY. MMMM')}</Typography>
        <Button onClick={() => onMonthChange(1)}>Következő hónap</Button>
      </Stack>

        <FormControl variant="outlined" size="small">
          <InputLabel>Naptár</InputLabel>
          <Select
            value={selectedCalendar}
            onChange={(e) => setSelectedCalendar(e.target.value)}
            label="Naptár"
          >
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} value={calendar.id}>
                {calendar.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Stack>
  );
};

export default CalendarHeader;
