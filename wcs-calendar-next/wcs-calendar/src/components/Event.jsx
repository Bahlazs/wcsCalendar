import { Box, Typography } from "@mui/material"

const Event = ({name, color, textColor}) => {
    return <Box bgcolor={color}>
        <Typography color={textColor} variant="body2">{name}</Typography>
    </Box>
}

export default Event