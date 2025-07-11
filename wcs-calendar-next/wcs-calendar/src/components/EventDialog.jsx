import { Box, Typography, Stack, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
import dayjs from 'dayjs';

// Ellenőrzi, van-e HTML tag
const hasHTML = (text) => /<\/?[a-z][\s\S]*>/i.test(text);

// Linkeket felismer és <a> tagre cserél
const linkifyText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const EventDialog = ({event, open, handleClose}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="textSecondary">
            <strong>Időpont:</strong> {dayjs(event.start).format('YYYY. MM. DD. HH:mm')}
            {event.end ? ` - ${dayjs(event.end).format('HH:mm')}` : ''}
          </Typography>

          <Divider />

          {hasHTML(event.type) ? (
            <Box
              sx={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
              dangerouslySetInnerHTML={{ __html: event.type }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {linkifyText(event.type)}
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;
