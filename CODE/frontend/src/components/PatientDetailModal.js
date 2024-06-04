import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  Email,
  Event,
  FavoriteBorder,
  FitnessCenter,
  Height,
  Home,
  Numbers,
  Person,
  Phone,
  Tag,
  Wc,
  Edit,
  Delete,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

const PatientDetailModal = ({ open, onClose, selectedPatient, onDelete, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [patientDetails, setPatientDetails] = useState(selectedPatient || {});

  useEffect(() => {
    setPatientDetails(selectedPatient || {});
  }, [selectedPatient]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleSaveClick = async () => {
    const payload = {
      _id: patientDetails._id,
      ...patientDetails
    };
    try {
      const response = await fetch(`http://127.0.0.1:5000/patients/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        enqueueSnackbar('Details updated successfully', { variant: 'success' });
        onUpdate(patientDetails);
        setIsEditing(false);
      } else {
        enqueueSnackbar(`Error: ${result.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error updating patient', { variant: 'error' });
      console.error('Error updating patient:', error);
    }
  };

  const handleDeleteClick = async () => {
    const payload = {
      _id: patientDetails._id,
      name: patientDetails.name,
      email: patientDetails.email
    };
    try {
      const response = await fetch(`http://127.0.0.1:5000/patients/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === 'success') {
        enqueueSnackbar('Patient deleted successfully', { variant: 'success' });
        onDelete(patientDetails._id);
        onClose();
      } else {
        enqueueSnackbar(`Error: ${result.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting patient', { variant: 'error' });
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '400px', p: 4, bgcolor: 'background.paper', m: '50px auto', borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
        {selectedPatient && (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Patient Details</Typography>
              {!isEditing && (
                <IconButton onClick={handleEditClick}>
                  <Edit />
                </IconButton>
              )}
            </Box>
            <Divider />
            <List>
              {Object.entries(patientDetails).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    {key === 'name' && <Person />}
                    {key === 'age' && <Numbers />}
                    {key === 'weight' && <FitnessCenter />}
                    {key === 'height' && <Height />}
                    {key === 'contact' && <Phone />}
                    {key === 'email' && <Email />}
                    {key === 'address' && <Home />}
                    {key === 'gender' && <Wc />}
                    {key === 'bloodGroup' && <FavoriteBorder />}
                    {key === 'appointments' && <Event />}
                    {key === 'id' && <Tag />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                        />
                      ) : (
                        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {isEditing && (
                <Button variant="contained" onClick={handleSaveClick}>
                  Save
                </Button>
              )}
              <Button variant="contained" color="error" onClick={handleDeleteClick}>
                Delete
              </Button>
              <Button variant="contained" onClick={onClose}>Close</Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

PatientDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedPatient: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

PatientDetailModal.defaultProps = {
  selectedPatient: null,
};

export default PatientDetailModal;
