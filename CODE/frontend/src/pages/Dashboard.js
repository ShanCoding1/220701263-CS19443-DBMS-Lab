import React from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Departments from '../components/Departments';
import Schedule from '../components/Schedule';
import {Box, Typography} from '@mui/material';
import {AccountCircleOutlined, EventOutlined, HotelOutlined, LocalHospitalOutlined,} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data for the statistics
  const stats = [
    { title: 'Total Patients', value: 500, icon: <AccountCircleOutlined /> },
    { title: 'Total Appointments', value: 750, icon: <EventOutlined />},
    { title: 'Total Surgeries', value: 100, icon: <LocalHospitalOutlined /> },
    { title: 'Total Wards', value: 20, icon: <HotelOutlined /> },
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, ml: '16rem', overflowY: 'auto', p: 3, justifyContent: 'center'}}>
        <Typography variant="h6" gutterBottom>
          Dashboard
        </Typography>
        <div className="flex flex-wrap justify-center">
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>
        <div className="flex">
          <div style={{ width: '70%', padding: '20px' }}>
            <Departments />
          </div>
          <div style={{ width: '50%', padding: '20px' }}>
            <Schedule />
          </div>
        </div>
      </Box>
    </Layout>
  );
};

export default Dashboard;
