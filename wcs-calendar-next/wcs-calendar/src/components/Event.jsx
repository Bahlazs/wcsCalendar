import { Box, Typography, Stack, Tooltip } from "@mui/material";

const Event = ({ name, color, textColor }) => {
  return (
    <Tooltip
      title={
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
            variant="body2"
            sx={{
              color: textColor,
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
            }}
          >
            {name}
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
        sx={{
          p: 0.5,
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'default',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflowX: 'hidden',
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
            {name}
          </Typography>
        </Stack>
      </Box>
    </Tooltip>
  );
};

export default Event;
