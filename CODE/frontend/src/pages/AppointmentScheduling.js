import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Add, EventAvailable, SearchOutlined } from '@mui/icons-material';
import Layout from '../components/Layout';
import AppointmentTable from '../components/AppointmentTable';
import Heading from '../components/Heading';
import { useDataContext } from '../context/DataContext';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns'; // Import date-fns

const AppointmentScheduling = () => {
  const { doctors, patients, appointments, setAppointments } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState({ id: '', name: '', contact: '' });
  const [doctorDetails, setDoctorDetails] = useState({ id: '', name: '', department: '' });
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [reason, setReason] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFilteredAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    const filterAppointments = () => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = appointments.filter((appointment) => {
        const doctorName = appointment.doctorName?.toLowerCase() || '';
        const patientName = appointment.patientName?.toLowerCase() || '';
        return doctorName.includes(lowerCaseQuery) || patientName.includes(lowerCaseQuery);
      });
      setFilteredAppointments(filtered);
    };
  
    filterAppointments();
  }, [searchQuery, appointments]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setPatientDetails({ id: '', name: '', contact: '' });
    setDoctorDetails({ id: '', name: '', department: '' });
    setReason('');
    setAppointmentDateTime('');
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });

    if (name === 'id') {
      const patient = patients.find((p) => p.id === value);
      if (patient) {
        setPatientDetails(patient);
      }
    } else if (name === 'name') {
      const patient = patients.find((p) => p.name === value);
      if (patient) {
        setPatientDetails(patient);
      }
    }
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails({ ...doctorDetails, [name]: value });

    if (name === 'id') {
      const doctor = doctors.find((d) => d.id === value);
      if (doctor) {
        setDoctorDetails(doctor);
      }
    } else if (name === 'department') {
      const doctor = doctors.find((d) => d.department === value);
      if (doctor) {
        setDoctorDetails(doctor);
      }
    }
  };

  const handleAppointmentDateTimeChange = (e) => {
    setAppointmentDateTime(e.target.value);
  };

  const handleAppointmentSubmit = async () => {
    try {
      const formattedDateTime = format(new Date(appointmentDateTime), 'yyyy-MM-dd HH:mm:ss'); // Format datetime correctly

      const appointmentData = {
        patientId: patientDetails.id,
        patientName: patientDetails.name,
        contact: patientDetails.contact,
        department: doctorDetails.department,
        doctorName: doctorDetails.name,
        appointment_time: formattedDateTime,
        reason: reason
      };

      console.log('Appointment data:', appointmentData); // Added for troubleshooting

      const response = await fetch('http://127.0.0.1:5000/appointment/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      console.log('Response:', response); // Added for troubleshooting

      if (!response.ok) {
        throw new Error('Failed to submit appointment');
      }

      const newAppointment = await response.json();
      console.log('New Appointment:', newAppointment); // Added for troubleshooting

      setAppointments([...appointments, newAppointment]);
      enqueueSnackbar('Appointment scheduled successfully', { variant: 'success' });
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting appointment:', error.message);
      enqueueSnackbar('Failed to schedule appointment', { variant: 'error' });
    }
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, ml: '16rem', overflowY: 'auto', p: 3 }}>
        <Heading text="Appointments" />
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Appointments"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Todays Appointments</Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenModal}>
            Create Appointment
          </Button>
        </Box>
        {filteredAppointments.length ? (
          <AppointmentTable appointments={filteredAppointments} />
        ) : (
          <Typography>No appointments scheduled for today! Have a great day!!!</Typography>
        )}
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: '600px', p: 4, bgcolor: 'background.paper', m: '50px auto', borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Create Appointment</Typography>
              <Button variant="contained" color="primary" onClick={handleAppointmentSubmit} startIcon={<EventAvailable />}>
                Confirm Appointment
              </Button>
            </Box>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Patient ID"
                  variant="outlined"
                  name="id"
                  value={patientDetails.id}
                  onChange={handlePatientChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Patient Name"
                  variant="outlined"
                  name="name"
                  value={patientDetails.name}
                  onChange={handlePatientChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Contact"
              variant="outlined"
              name="contact"
              value={patientDetails.contact}
              fullWidth
              disabled
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={doctorDetails.department}
                    onChange={handleDoctorChange}
                    label="Department"
                  >
                    {Array.from(new Set(doctors.map(doc => doc.department))).map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="id"
                    value={doctorDetails.id}
                    onChange={handleDoctorChange}
                    label="Doctor"
                  >
                    {doctors
                      .filter(doc => doc.department === doctorDetails.department)
                      .map(doc => (
                        <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Date and Time"
              variant="outlined"
              type="datetime-local"
              name="appointmentDateTime"
              value={appointmentDateTime}
              onChange={handleAppointmentDateTimeChange}
              fullWidth
            />
            <TextField
              label="Reason for Appointment"
              variant="outlined"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />
          </Stack>
        </Box>
      </Modal>
    </Layout>
  );
};

export default AppointmentScheduling;
