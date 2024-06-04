import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const AppointmentTable = ({ appointments }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Doctor</TableCell>
          <TableCell>Appointment Time</TableCell>
          <TableCell>Department</TableCell>
          <TableCell>Reason</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{appointment.doctorName}</TableCell>
            <TableCell>{appointment.appointmentTime}</TableCell>
            <TableCell>{appointment.department}</TableCell>
            <TableCell>{appointment.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AppointmentTable;
