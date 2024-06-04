// components/Schedule.js

import React, {useState} from 'react';
import {Box, Button, Divider, IconButton, List, ListItem, ListItemText, Typography} from '@mui/material';
import {styled} from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import {addDays, format, startOfToday} from 'date-fns';

const generateDates = () => {
  const today = startOfToday();
  const days = [];
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const nextDate = addDays(today, i);
    days.push(format(nextDate, 'EEE')); // Get short day name (e.g., Mon, Tue)
    dates.push(format(nextDate, 'd')); // Get day of the month (e.g., 11, 12)
  }
  return { days, dates, month: format(today, 'MMMM'), year: format(today, 'yyyy') };
};

const { days, dates, month, year } = generateDates();

const data = [
  { date: '11 April 2024', day: 'Mon', schedule: [{ type: 'Heart Surgery', time: '10 AM - 1 PM', doctor: 'Devon Lane' }, { type: 'Cardiology Checkup', time: '2 PM - 3 PM', doctor: 'Dr. Strange' }, { type: 'Dental Surgery', time: '4 PM - 6 PM', doctor: 'Dr. Tooth' }], upcoming: [] },
  { date: '12 April 2024', day: 'Tue', schedule: [{ type: 'Orthopedic Surgery', time: '9 AM - 12 PM', doctor: 'Dr. Bone' }, { type: 'Neurology Checkup', time: '1 PM - 3 PM', doctor: 'Dr. Brain' }], upcoming: [] },
  { date: '13 April 2024', day: 'Wed', schedule: [{ type: 'Dermatology Consultation', time: '10 AM - 11 AM', doctor: 'Dr. Skin' }, { type: 'Pediatric Checkup', time: '11 AM - 1 PM', doctor: 'Dr. Kid' }], upcoming: [] },
  { date: '14 April 2024', day: 'Thu', schedule: [{ type: 'General Surgery', time: '8 AM - 10 AM', doctor: 'Dr. General' }, { type: 'ENT Consultation', time: '2 PM - 4 PM', doctor: 'Dr. Ear' }], upcoming: [] },
  { date: '15 April 2024', day: 'Fri', schedule: [{ type: 'Gynecology Checkup', time: '9 AM - 11 AM', doctor: 'Dr. Woman' }, { type: 'Urology Surgery', time: '12 PM - 2 PM', doctor: 'Dr. Kidney' }], upcoming: [] },
];

const CalendarButton = styled(Button)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  minWidth: 60,
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  backgroundColor: selected ? theme.palette.secondary.main : '#e0e0e0',
  '&:hover': {
    backgroundColor: selected ? theme.palette.secondary.dark : '#bdbdbd',
  },
  borderRadius: 8,
}));

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const selectedData = data.find(item => item.day === selectedDay) || { schedule: [], upcoming: [] };

  return (
    <Box sx={{ padding: 2, maxWidth: 400, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          {month} {year}
        </Typography>
        <IconButton color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        {days.map((day, index) => (
          <CalendarButton
            key={day}
            onClick={() => setSelectedDay(day)}
            selected={selectedDay === day}
            variant={selectedDay === day ? 'contained' : 'outlined'}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2">{day}</Typography>
              <Typography variant="caption">{dates[index]}</Typography>
            </Box>
          </CalendarButton>
        ))}
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Divider />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Schedule
        </Typography>
        <List>
          {selectedData.schedule.length > 0 ? selectedData.schedule.map((item, index) => (
            <ListItem key={index} sx={{ paddingLeft: 0 }}>
              <ListItemText primary={`${item.type} (${item.time})`} secondary={item.doctor} />
            </ListItem>
          )) : <Typography>No schedule for this day.</Typography>}
        </List>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h6" component="div">
          Upcoming
        </Typography>
        <List>
          {selectedData.upcoming.map((item, index) => (
            <ListItem key={index} sx={{ paddingLeft: 0 }}>
              <ListItemText primary={`${item.type} (${item.time})`} secondary={item.doctor} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Schedule;
