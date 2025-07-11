import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import Event from './Event';

const CalendarGrid = ({ weekDays, calendarDays, getEventsForDate, getColorForEvent, today }) => {
  
  return (
  <Grid container columns={7} spacing={2}>
    {weekDays.map((day, i) => (
      <Grid size={1} key={i}>
        <Typography align="center" fontWeight="bold">
          {day}
        </Typography>
      </Grid>
    ))}

    {calendarDays.map(({ date, current }, idx) => {
      const eventsForDate = getEventsForDate(date)
      const hasOverflow = eventsForDate.length > 3
      return <Grid size={1} key={idx}>
       <Card
            sx={{
              position: 'relative',
              overflow: 'visible',
              height: 160,
              backgroundColor: !current
                ? '#f0f0f0'
                : date.isSame(today, 'day')
                  ? '#e0f7fa'
                  : 'white',
              transition: 'transform 0.3s ease',
              '&:hover': {
                zIndex: 10,
              },
            }}
          >
          <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="caption" color="textSecondary">
                {date.date()}
              </Typography>
            </Box>
            {current && (
             <Box
                className="event-list"
                display='flex'
                flexDirection='column'
                flexGrow={1}
                overflow='hidden'
                gap='2px'
                sx={{
                  position: 'relative',
                  mt: 1,
                  maxHeight: 100,       
                  ...(hasOverflow && {
                      '&:hover': {
                        position: 'absolute',
                        top: 24,
                        left: 0,
                        right: 0,
                        minHeight: 100,
                        maxHeight: 400,
                        paddingInline: '8px',
                        paddingBottom: '16px',
                        overflow: 'auto',
                        backgroundColor: 'white',
                        boxShadow: 6,
                        zIndex: 10
                      },
                    }),
                }}
              >
                {eventsForDate.map((event, index) => (
                  <Event key={index} event={event} color={getColorForEvent(event.id)} textColor={'white'}/>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    })}
  </Grid>
)};

export default CalendarGrid;