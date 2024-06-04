import React from 'react';
import {Box, Card, CardContent, Typography} from '@mui/material';

const StatCard = ({ title, value, icon }) => {
  return (
    <Card
      sx={{
        minWidth: 225,
        margin: 1,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
          }}
        >
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }} gutterBottom>
            {title}
          </Typography>
          <Box
            sx={{
              minWidth: 35,
              width: 35,
              height: 35,
              borderRadius: '50%',
              backgroundColor: '#bac3cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {icon && icon}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
          <Typography variant="h5" component="div" sx={{ color: 'primary.main' }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
