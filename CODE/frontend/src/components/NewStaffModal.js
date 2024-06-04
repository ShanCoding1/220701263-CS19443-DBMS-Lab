import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const NewStaffModal = ({ open, onClose, newStaffDetails, onChange, onSubmit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    const { position, name, age, email, password, specialization, experience, education, contact, address, assignedDoctor, shift, gender, department } = newStaffDetails;

    let payload = {
      name,
      age,
      email,
      password,
      contact_number: contact,
      address,
      experience_years: experience,
      education,
      shift,
      gender,
      department,
    };

    if (position.toLowerCase() === 'doctor') {
      payload = {
        ...payload,
        specialization,
      };
    } else if (position.toLowerCase() === 'nurse') {
      payload = {
        ...payload,
        assignedDoctor,
      };
    }

    try {
      const endpoint = position.toLowerCase() === 'doctor' ? '/doctor/add' : position.toLowerCase() === 'nurse' ? '/nurse/add' : '';
      if (!endpoint) {
        enqueueSnackbar('Invalid position selected', { variant: 'error' });
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(`${position} added successfully`, { variant: 'success' });
        onSubmit();
        onClose();
      } else {
        enqueueSnackbar(data.message || 'Error adding staff', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 4, bgcolor: 'background.paper', m: '50px auto', borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '90vh' }}>
        <Typography variant="h5">New Staff</Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={newStaffDetails.name}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Age"
            variant="outlined"
            name="age"
            value={newStaffDetails.age}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={newStaffDetails.email}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            value={newStaffDetails.password}
            onChange={onChange}
            fullWidth
            type="password"
          />
          <TextField
            label="Gender"
            variant="outlined"
            name="gender"
            value={newStaffDetails.gender}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Department"
            variant="outlined"
            name="department"
            value={newStaffDetails.department}
            onChange={onChange}
            fullWidth
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              name="position"
              value={newStaffDetails.position}
              onChange={onChange}
              label="Position"
            >
              <MenuItem value="Doctor">Doctor</MenuItem>
              <MenuItem value="Nurse">Nurse</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Support Staff">Support Staff</MenuItem>
            </Select>
          </FormControl>
          {newStaffDetails.position === 'Doctor' && (
            <TextField
              label="Specialization"
              variant="outlined"
              name="specialization"
              value={newStaffDetails.specialization}
              onChange={onChange}
              fullWidth
            />
          )}
          <TextField
            label="Experience (years)"
            variant="outlined"
            name="experience"
            value={newStaffDetails.experience}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Education"
            variant="outlined"
            name="education"
            value={newStaffDetails.education}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Contact"
            variant="outlined"
            name="contact"
            value={newStaffDetails.contact}
            onChange={onChange}
            fullWidth
          />
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            value={newStaffDetails.address}
            onChange={onChange}
            fullWidth
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Shift</InputLabel>
            <Select
              name="shift"
              value={newStaffDetails.shift}
              onChange={onChange}
              label="Shift"
            >
              <MenuItem value="Day">Day</MenuItem>
              <MenuItem value="Night">Night</MenuItem>
            </Select>
          </FormControl>
          {newStaffDetails.position === 'Nurse' && (
            <TextField
              label="Assigned Doctor"
              variant="outlined"
              name="assignedDoctor"
              value={newStaffDetails.assignedDoctor}
              onChange={onChange}
              fullWidth
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewStaffModal;
