import { useState } from "react";
import { Box, Typography, Stack, Tooltip } from "@mui/material";
import dayjs from 'dayjs';
import EventDialog from "./EventDialog";
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const Event = ({ event, color, textColor, renderDate }) => {
  const [open, setOpen] = useState(false);
  const startDateTime = event.start ? dayjs(event.start) : null;
  const startTime = startDateTime ? startDateTime.format('HH:mm') : '';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isMultiDay = event.end && !dayjs(event.start).isSame(event.end, 'day');
  const isFirstDay = renderDate && dayjs(renderDate).isSame(dayjs(event.start), 'day');
  const isAllDayFirst = isMultiDay && isFirstDay && startTime === '00:00';

  return (
    <>
      <Tooltip
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: textColor,
                flexShrink: 0,
              }}
            />
            {isMultiDay && !isFirstDay ? (
              <>
                <EventRepeatIcon sx={{ fontSize: 16, color: textColor }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: textColor,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {event.title}
                </Typography>
              </>
            ) : isAllDayFirst ? (
              <>
                <EventAvailableIcon sx={{ fontSize: 16, color: textColor }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: textColor,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {event.title}
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: textColor,
                  }}
                >
                  {startTime}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: textColor,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {event.title}
                </Typography>
              </>
            )}
          </Stack>
        }
        arrow
        placement="top"
        disableInteractive
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: color,
              color: textColor,
              borderRadius: 1,
              boxShadow: 6,
              px: 1.5,
              py: 1,
              maxWidth: 220,
              fontSize: '0.85rem',
            },
          },
          arrow: {
            sx: {
              color: color,
            },
          },
        }}
      >
        <Box
          bgcolor={color}
          minHeight={30}
          onClick={handleOpen}
          sx={{
            p: 0.5,
            borderRadius: 1,
            overflow: 'hidden',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: textColor,
                flexShrink: 0,
              }}
            />
            {isMultiDay && !isFirstDay ? (
              <>
                <EventRepeatIcon sx={{ fontSize: 16, color: textColor }} />
                <Typography
                  color={textColor}
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {event.title}
                </Typography>
              </>
            ) : isAllDayFirst ? (
              <>
                <EventAvailableIcon sx={{ fontSize: 16, color: textColor }} />
                <Typography
                  color={textColor}
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {event.title}
                </Typography>
              </>
            ) : (
              <Typography
                color={textColor}
                variant="body2"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {`${startTime} ${event.title}`}
              </Typography>
            )}
          </Stack>
        </Box>
      </Tooltip>

      <EventDialog event={event} open={open} handleClose={handleClose} />
    </>
  );
};

export default Event;
