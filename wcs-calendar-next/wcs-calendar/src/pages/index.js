import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import dayjs from 'dayjs';
import CalendarHeader from '../../components/CalendarHeader';
import CalendarGrid from '../../components/CalendarGrid';

const filters = ['Minden', 'Buli', 'Óra', 'Táncóra'];

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedFilter, setSelectedFilter] = useState('Minden');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDate, setSelectedEventDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Sikertelen lekérés');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError('Nem sikerült betölteni az eseményeket.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const filteredEvents = events.filter(event => selectedFilter === 'Minden' || event.type === selectedFilter);

  const getEventsForDate = (date) => filteredEvents.filter(event => dayjs(event.start).isSame(date, 'day'));

  const handleMonthChange = (offset) => setCurrentDate(currentDate.add(offset, 'month'));

  const handleEventClick = (event, date) => {
    setSelectedEvent(event);
    setSelectedEventDate(date);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setSelectedEventDate(null);
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
  const weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Naptár</Typography>
      <CalendarHeader
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filters={filters}
      />
      {loading && <CircularProgress sx={{ my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <CalendarGrid
          weekDays={weekDays}
          calendarDays={calendarDays}
          getEventsForDate={getEventsForDate}
          onEventClick={handleEventClick}
        />
      )}

      <Dialog open={Boolean(selectedEvent)} onClose={handleCloseDialog}>
        <DialogTitle>Esemény részletei</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Cím:</strong> {selectedEvent?.title}<br />
            <strong>Típus:</strong> {selectedEvent?.type}<br />
            <strong>Dátum:</strong> {selectedEventDate?.format('YYYY-MM-DD')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Bezárás</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}