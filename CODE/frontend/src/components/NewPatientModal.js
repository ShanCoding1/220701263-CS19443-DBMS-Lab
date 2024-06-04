import React from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

const NewPatientModal = ({ open, onClose, newPatientDetails, onChange, onSubmit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    const {
      name, age, weight, height, contact, email, address, gender, bloodGroup, appointments
    } = newPatientDetails;

    const payload = {
      name,
      age,
      weight,
      height,
      contact,
      email,
      address,
      gender,
      bloodGroup,
      appointments,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/patients/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar('Patient added successfully', { variant: 'success' });
        onSubmit();
        onClose();
      } else {
        enqueueSnackbar(data.message || 'Error adding patient', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '600px',
          p: 4,
          bgcolor: 'background.paper',
          m: '50px auto',
          borderRadius: 2,
          boxShadow: 24,
          overflowY: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add New Patient</Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                value={newPatientDetails.name}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Age"
                variant="outlined"
                name="age"
                value={newPatientDetails.age}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Weight (kg)"
                variant="outlined"
                name="weight"
                value={newPatientDetails.weight}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Height (cm)"
                variant="outlined"
                name="height"
                value={newPatientDetails.height}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact"
                variant="outlined"
                name="contact"
                value={newPatientDetails.contact}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={newPatientDetails.email}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address"
                variant="outlined"
                name="address"
                value={newPatientDetails.address}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Gender"
                variant="outlined"
                name="gender"
                value={newPatientDetails.gender}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Blood Group"
                variant="outlined"
                name="bloodGroup"
                value={newPatientDetails.bloodGroup}
                onChange={onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Appointments"
                variant="outlined"
                name="appointments"
                value={newPatientDetails.appointments}
                onChange={onChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NewPatientModal;
