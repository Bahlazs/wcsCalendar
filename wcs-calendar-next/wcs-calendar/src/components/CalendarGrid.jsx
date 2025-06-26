import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';

const CalendarGrid = ({ weekDays, calendarDays, getEventsForDate }) => (
  <Grid container columns={7} spacing={2}>
    {weekDays.map((day, i) => (
      <Grid size={1} key={i}>
        <Typography align="center" fontWeight="bold">
          {day}
        </Typography>
      </Grid>
    ))}

    {calendarDays.map(({ date, current }, idx) => (
      <Grid size={1} key={idx}>
        <Card sx={{ backgroundColor: current ? 'white' : '#f0f0f0', minHeight: 120, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="caption" color="textSecondary">
                {date.date()}
              </Typography>
            </Box>
            {current && (
              <Box sx={{ overflowY: 'auto', mt: 1, flexGrow: 1 }}>
                {getEventsForDate(date).map((event, index) => (
                  <Typography key={index} variant="body2" noWrap>
                    {event.title}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default CalendarGrid;