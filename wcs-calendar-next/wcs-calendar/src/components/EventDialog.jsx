import { Box, Typography, Stack, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
import dayjs from 'dayjs';

const EventDialog = ({event, open, handleClose}) => {
    return <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>{event.title}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Időpont:</strong> {dayjs(event.start).format('YYYY. MM. DD. HH:mm')}
                        {event.end ? ` - ${dayjs(event.end).format('HH:mm')}` : ''}
                    </Typography>

                    <Divider />

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
                    </Stack>
                </DialogContent>
             </Dialog>

}

export default EventDialog