import React from 'react';
import { Grid, Typography, Card, CardContent, Box, useMediaQuery } from '@mui/material';
import Event from './Event';

const isTouchDevice = () => {
  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  return false;
};

const CalendarGrid = ({ weekDays, calendarDays, getEventsForDate, getColorForEvent, today }) => {
  const isTooNarrow = useMediaQuery('(max-width: 900px)');

  return (
    <>
      <Grid container columns={7} spacing={2}>
        {weekDays.map((day, i) => (
          <Grid size={1} key={i}>
            <Typography align="center" fontWeight="bold">
              {day}
            </Typography>
          </Grid>
        ))}

        {calendarDays.map(({ date, current }, idx) => {
          const eventsForDate = getEventsForDate(date);
          const hasOverflow = eventsForDate.length > 3;

          return (
            <Grid size={1} key={idx}>
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
                <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box display="flex" justifyContent="flex-end">
                    <Typography variant="caption" color="textSecondary">
                      {date.date()}
                    </Typography>
                  </Box>
                  {current && (
                    <Box
                      className="event-list"
                      display="flex"
                      flexDirection="column"
                      flexGrow={1}
                      gap="2px"
                      sx={{
                        position: 'relative',
                        mt: 1,
                        maxHeight: 100,
                        ...(hasOverflow && (
                          isTouchDevice()
                            ? {
                                overflowY: 'auto',
                                maxHeight: 400,
                                pr: 1,
                                WebkitOverflowScrolling: 'touch',
                              }
                            : {
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
                                  zIndex: 10,
                                },
                              }
                        )),
                      }}
                    >
                      {eventsForDate.map((event, index) => (
                        <Event
                          key={index}
                          event={event}
                          color={getColorForEvent(event.id)}
                          textColor={'white'}
                          renderDate={date}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {isTooNarrow && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            Ajánlott fekvő módban vagy asztali gépen használni a naptárt (Recommended to use the calendaron desktop or in landscape mode)
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CalendarGrid;

