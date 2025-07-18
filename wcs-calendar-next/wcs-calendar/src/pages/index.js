// pages/index.js
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
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
  { id: 2, name: 'extrahaladó óra/klub' },
  { id: 3, name: 'haladó óra' },
  { id: 4, name: 'kezdő óra' },
  { id: 5, name: 'középhaladó óra' },
  { id: 6, name: 'szintfüggetlen/styling' },
  { id: 7, name: 'versenyző' },
  { id: 8, name: 'workshop' },
  { id: 9, name: 'kezdő workshop' },
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

  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(utc);
  dayjs.extend(timezone);

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
    const eventsForDate = filteredEvents.filter(event => {
      const start = dayjs(event.start);
      const end = dayjs(event.end);

      if (!end.isValid()) {
        return start.isSame(date, 'day');
      }

      const isAfterStart = date.isSame(start, 'day') || date.isAfter(start, 'day');
      let isBeforeEnd;

      if (date.isSame(end, 'day')) {
        isBeforeEnd = end.hour() >= 6;
      } else {
        isBeforeEnd = date.isBefore(end, 'day');
      }

      return isAfterStart && isBeforeEnd;
    });

    return eventsForDate.sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
  };

  const getColorForId = (id) => {
    const found = COLORS.find(item => item.id === id);
    return found ? found.color : '#000';
  };

  const handleMonthChange = (offset) => {
    const newDate = currentDate.add(offset, 'month');
    const minDate = dayjs().subtract(2, 'month').startOf('month');
    const maxDate = dayjs().add(6, 'month').startOf('month');

    if (newDate.isBefore(minDate) || newDate.isAfter(maxDate)) return;

    setCurrentDate(newDate);
  };

  const minReached = currentDate.isSameOrBefore(dayjs().subtract(2, 'month'), 'month');
  const maxReached = currentDate.isSameOrAfter(dayjs().add(6, 'month'), 'month');

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

      <CalendarHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        calendars={CALENDARS}
        selectedCalendars={selectedCalendars}
        setSelectedCalendars={setSelectedCalendars}
        disablePrev={minReached}
        disableNext={maxReached}
      />

      <Fade in={!loading} timeout={500}>
        <Box>
          <CalendarGrid
            weekDays={WEEK_DAYS}
            calendarDays={calendarDays}
            getEventsForDate={getEventsForDate}
            getColorForEvent={getColorForId}
            today={dayjs().tz('Europe/Budapest')}
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
