import React from 'react';
import {Box, Typography} from '@mui/material';
import theme from '@/styles/theme';

const Heading = ({ text }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          color: '#3f51b5',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {text}
      </Typography>
      <Box
        sx={{
          ml: 2,
          width: '100px',
          height: '4px',
          bgcolor: theme.palette.primary.main,
          borderRadius: '2px',
        }}
      />
    </Box>
  );
};

export default Heading;
