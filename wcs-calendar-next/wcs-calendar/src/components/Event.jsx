import { useState } from "react";
import { Box, Typography, Stack, Tooltip} from "@mui/material";
import dayjs from 'dayjs';
import EventDialog from "./EventDialog";

const Event = ({ event, color, textColor }) => {
  const [open, setOpen] = useState(false);
  const startTime = event.start ? dayjs(event.start).format('HH:mm') : '';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip
        title={
          <Stack direction="row" spacing={1} alignItems="center">
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
          </Stack>
        </Box>
      </Tooltip>

      <EventDialog event={event} open={open} handleClose={handleClose}></EventDialog>

    </>
  );
};

export default Event;

