import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { Add, SearchOutlined, Info } from '@mui/icons-material';
import Layout from '../components/Layout';
import Heading from '../components/Heading';
import NewPatientModal from '../components/NewPatientModal';
import PatientDetailModal from '../components/PatientDetailModal';
import { useDataContext } from '../context/DataContext';

const Patient = () => {
  const { patients, setPatients } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatientDetails, setNewPatientDetails] = useState({
    name: '', age: '', weight: '', height: '', contact: '',
    email: '', address: '', gender: '', bloodGroup: '', appointments: ''
  });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    const filterPatients = () => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(lowerCaseQuery) ||
          patient.id.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredPatients(filtered);
    };
    filterPatients();
  }, [searchQuery, patients]);

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

  const handleOpenDetailModal = (patient) => {
    setSelectedPatient(patient);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedPatient(null);
  };

  const resetForm = () => {
    setNewPatientDetails({
      name: '', age: '', weight: '', height: '', contact: '',
      email: '', address: '', gender: '', bloodGroup: '', appointments: ''
    });
  };

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatientDetails({ ...newPatientDetails, [name]: value });
  };

  const handleNewPatientSubmit = async () => {
    try {
      await addPatient(newPatientDetails);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  const handleDeletePatient = (patientId) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== patientId));
  };

  const handleUpdatePatient = (updatedPatient) => {
    if (!updatedPatient) return;

    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    );
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy) => {
    if (a[orderBy] < b[orderBy]) {
      return -1;
    }
    if (a[orderBy] > b[orderBy]) {
      return 1;
    }
    return 0;
  };

  const sortedPatients = filteredPatients.sort((a, b) => (
    order === 'asc' ? sortComparator(a, b, orderBy) : sortComparator(b, a, orderBy)
  ));

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, ml: '16rem', overflowY: 'auto', maxHeight: '100vh-10px', p: 3 }}>
        <Heading text="Patient Management" />
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Patients"
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
          <Typography variant="h6">Patient List</Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenModal}>
            Add New Patient
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    Patient ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'age' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'age'}
                    direction={orderBy === 'age' ? order : 'asc'}
                    onClick={() => handleRequestSort('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Appointments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>{patient.appointments}</TableCell>
                  <TableCell>
                    <Button variant="outlined" startIcon={<Info />} onClick={() => handleOpenDetailModal(patient)}>
                      Show More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <NewPatientModal
        open={openModal}
        onClose={handleCloseModal}
        newPatientDetails={newPatientDetails}
        onChange={handleNewPatientChange}
        onSubmit={handleNewPatientSubmit}
        />
         <PatientDetailModal
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          selectedPatient={selectedPatient}
          onDelete={handleDeletePatient}
          onUpdate={handleUpdatePatient}
        />
      </Layout>
  );
};

export default Patient;
