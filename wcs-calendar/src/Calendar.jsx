import React, { useEffect, useState } from 'react';
import { Grid, Typography, MenuItem, Select, FormControl, InputLabel, Container, Box, Card, CardContent, Button} from '@mui/material';
import dayjs from 'dayjs';

const filters = ['Minden', 'Buli', 'Óra', 'Táncóra'];

const API_KEY = 'YOUR_GOOGLE_API_KEY';
const CALENDAR_ID = 'YOUR_CALENDAR_ID@group.calendar.google.com';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedFilter, setSelectedFilter] = useState('Minden');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const timeMin = currentDate.startOf('month').toISOString();
        const timeMax = currentDate.endOf('month').toISOString();

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
        );

        const data = await response.json();
        const formatted = data.items.map(event => ({
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          type: event.description || 'Minden',
        }));

        setEvents(formatted);
      } catch (err) {
        console.error('Hiba a naptáradatok lekérésekor:', err);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf('month').day();
  const datesArray = Array.from({ length: daysInMonth + startDay }, (_, i) =>
    i < startDay ? null : currentDate.date(i - startDay + 1)
  );

  const filteredEvents = events.filter(event => {
    return selectedFilter === 'Minden' || event.type === selectedFilter;
  });

  const getEventsForDate = (date) => {
    if (!date) return [];
    return filteredEvents.filter(event => dayjs(event.start).isSame(date, 'day'));
  };

  const handleMonthChange = (offset) => {
    setCurrentDate(currentDate.add(offset, 'month'));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Naptár
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button onClick={() => handleMonthChange(-1)}>Előző hónap</Button>
        <Typography variant="h6">{currentDate.format('YYYY. MMMM')}</Typography>
        <Button onClick={() => handleMonthChange(1)}>Következő hónap</Button>

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

      <Grid container spacing={2}>
        {[...Array(7)].map((_, i) => (
          <Grid item xs={12 / 7} key={i}>
            <Typography align="center" fontWeight="bold">
              {dayjs().day(i).format('dddd')}
            </Typography>
          </Grid>
        ))}

        {datesArray.map((date, idx) => (
          <Grid item xs={12 / 7} key={idx}>
            <Card>
              <CardContent>
                {date && <Typography variant="subtitle2">{date.format('YYYY-MM-DD')}</Typography>}
                {getEventsForDate(date).map((event, index) => (
                  <Typography key={index} variant="body2">
                    {event.title}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Calendar;
