import React from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const CalendarHeader = ({ currentDate, onMonthChange, selectedFilter, setSelectedFilter, filters }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
    <Button onClick={() => onMonthChange(-1)}>Előző hónap</Button>
    <Typography variant="h6">{currentDate.format('YYYY. MMMM')}</Typography>
    <Button onClick={() => onMonthChange(1)}>Következő hónap</Button>

    <FormControl variant="outlined" size="small">
      <InputLabel>Szűrés</InputLabel>
      <Select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        label="Szűrés"
      >
        {filters.map(filter => (
          <MenuItem key={filter} value={filter}>{filter}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default CalendarHeader;