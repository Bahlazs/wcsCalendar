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
  selectedCalendars,
  setSelectedCalendars,
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
              multiple
              value={selectedCalendars}
              sx={{ width: 200 }}
              onChange={(e) => setSelectedCalendars(e.target.value)}
              label="Naptár"
              renderValue={(selected) =>
                calendars
                  .filter((cal) => selected.includes(cal.id))
                  .map((cal) => cal.name)
                  .join(', ')
              }
>
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} 
                        value={calendar.id}  
                        sx={{
                            '&.Mui-selected': {
                              backgroundColor: 'primary.dark',
                              color: 'white',
                            },
                            '&.Mui-selected:hover': {
                              backgroundColor: 'primary.main',
                            },
                          }}>
                {calendar.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Stack>
  );
};

export default CalendarHeader;
