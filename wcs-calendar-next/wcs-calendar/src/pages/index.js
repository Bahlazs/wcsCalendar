// pages/index.js
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Fade
} from '@mui/material';
import CalendarHeader from '../components/CalendarHeader.jsx';
import CalendarGrid from '@/components/CalendarGrid.jsx';


const CALENDARS = [
  { id: 0, name: 'bulik' },
  { id: 1, name: 'bemutató' },
  { id: 2, name: 'extrahaladó/klub' },
  { id: 3, name: 'haladó' },
  { id: 4, name: 'kezdő' },
  { id: 5, name: 'középhaladó' },
  { id: 6, name: 'szintfüggetlen/styling' },
  { id: 7, name: 'versenyző' },
  { id: 8, name: 'workshop' },
  { id: 9, name: 'workshop kezdő' },
];

const COLORS = [
  { id: 0, color: '#3f51b5' },
  { id: 1, color: '#9c27b0' },
  { id: 2, color: '#4caf50' },
  { id: 3, color: '#388e3c' },
  { id: 4, color: '#cddc39' },
  { id: 5, color: '#8bc34a' },
  { id: 6, color: '#D23C77' },
  { id: 7, color: '#f44336' },
  { id: 8, color: '#ff9800' },
  { id: 9, color: '#ffb74d' },
];

const WEEK_DAYS = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedCalendars, setSelectedCalendars] = useState([CALENDARS[0].id]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Események betöltése sikertelen:', error);
      } finally {
      setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => selectedCalendars.includes(event.id));

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => dayjs(event.start).isSame(date, 'day'));
  };

  const getColorForId = (id) => {
  const found = COLORS.find(item => item.id === id);
  return found ? found.color : '#000'; 
};

  const handleMonthChange = (offset) => {
    setCurrentDate(prev => prev.add(offset, 'month'));
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const startWeekDay = (startOfMonth.day() + 6) % 7;
    const days = [];

    const prevMonth = currentDate.subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();
    for (let i = startWeekDay - 1; i >= 0; i--) {
      days.push({ date: prevMonth.date(prevMonthDays - i), current: false });
    }

    for (let i = 1; i <= currentDate.daysInMonth(); i++) {
      days.push({ date: currentDate.date(i), current: true });
    }

    const total = days.length;
    const nextDays = (7 - (total % 7)) % 7;
    const nextMonth = currentDate.add(1, 'month');
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: nextMonth.date(i), current: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Naptár</Typography>

      <CalendarHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        calendars={CALENDARS}
        selectedCalendars={selectedCalendars}
        setSelectedCalendars={setSelectedCalendars}
      />

    <Fade in={!loading} timeout={500}>
    <Box>
      <CalendarGrid
        weekDays={WEEK_DAYS}
        calendarDays={calendarDays}
        getEventsForDate={getEventsForDate}
        getColorForEvent={getColorForId}
      />
    </Box>
  </Fade>

  <Fade in={loading} timeout={500} unmountOnExit>
    <Backdrop
      open
      sx={{
        position: 'absolute',
        zIndex: 10,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  </Fade>
    </Container>
  );
};

export default CalendarPage;
