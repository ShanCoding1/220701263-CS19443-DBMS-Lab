import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const DepartmentTable = ({ departments }) => {
  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Departments
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="department table">
          <TableHead>
            <TableRow>
              <TableCell>Dept ID</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Number of Staffs</TableCell>
              <TableCell>Number of Appointments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.index}>
                <TableCell>{dept.index}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.staffs}</TableCell>
                <TableCell>{dept.appointments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepartmentTable;
