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
  Business,
  Email,
  Event,
  Home,
  Person,
  School,
  Wc,
  Work,
  Edit,
  Delete,
  Cake,
  BarChart,
  Fingerprint,
  LocalHospital,
  PhoneAndroid,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

const StaffDetailsModal = ({ open, onClose, selectedStaff, onDelete, onUpdate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [staffDetails, setStaffDetails] = useState(selectedStaff || {});

  useEffect(() => {
    setStaffDetails(selectedStaff || {});
  }, [selectedStaff]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails({ ...staffDetails, [name]: value });
  };

  const handleSaveClick = async () => {
    const endpoint = selectedStaff.position === 'Doctor' ? '/doctor/update' : '/nurse/update';
    const payload = {
      _id: staffDetails._id,
      name: staffDetails.name,
      email: staffDetails.email,
      ...staffDetails
    };
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        enqueueSnackbar('Details updated successfully', { variant: 'success' });
        onUpdate(staffDetails);
        setIsEditing(false);
      } else {
        enqueueSnackbar(`Error: ${result.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error updating staff', { variant: 'error' });
      console.error('Error updating staff:', error);
    }
  };
  
  const handleDeleteClick = async () => {
    const endpoint = selectedStaff.position === 'Doctor' ? '/doctor/delete' : '/nurse/delete';
    const payload = {
      _id: staffDetails._id,
      name: staffDetails.name,
      email: staffDetails.email
    };
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === 'success') {
        enqueueSnackbar('Staff deleted successfully', { variant: 'success' });
        onDelete(selectedStaff._id);
        onClose();
      } else {
        enqueueSnackbar(`Error: ${result.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting staff', { variant: 'error' });
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '400px', p: 4, bgcolor: 'background.paper', m: '50px auto', borderRadius: 2, boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
        {selectedStaff && (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Staff Details</Typography>
              {!isEditing && (
                <IconButton onClick={handleEditClick}>
                  <Edit />
                </IconButton>
              )}
            </Box>
            <Divider />
            <List>
              {Object.entries(staffDetails).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    {key === 'name' && <Person />}
                    {key === 'age' && <Cake />}
                    {key === 'contact' && <PhoneAndroid/>}
                    {key === 'email' && <Email />}
                    {key === 'address' && <Home />}
                    {key === 'experience' && <BarChart />}
                    {key === 'education' && <School />}
                    {key === 'shift' && <Event />}
                    {key === 'gender' && <Wc />}
                    {key === 'department' && <Business />}
                    {key === 'specialization' && <LocalHospital />}
                    {key === 'id' && <Fingerprint />}
                    {key === 'position' && <Work />}
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

StaffDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedStaff: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

StaffDetailsModal.defaultProps = {
  selectedStaff: null,
};

export default StaffDetailsModal;
