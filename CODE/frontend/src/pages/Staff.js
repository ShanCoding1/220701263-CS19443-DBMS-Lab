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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Info, SearchOutlined } from '@mui/icons-material';
import Layout from '../components/Layout';
import Heading from '../components/Heading';
import NewStaffModal from '../components/NewStaffModal';
import StaffDetailsModal from '../components/StaffDetailsModal';
import { useDataContext } from '../context/DataContext';

const Staff = () => {
  const { doctors, nurses, setDoctors } = useDataContext();  // Assuming `addStaff` is a function in context to add new staff
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaffType, setSelectedStaffType] = useState('doctors');
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaffDetails, setNewStaffDetails] = useState({
    name: '', position: '', department: '', contact: '',
    email: '', address: '', gender: '', experience: '', 
    shift: '', assignedDoctor: ''
  });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    const filterStaff = () => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const staff = selectedStaffType === 'doctors' ? doctors : nurses;
      const filtered = staff.filter(
        (s) => s.name.toLowerCase().includes(lowerCaseQuery) || s.id.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredStaff(filtered);
    };
    filterStaff();
  }, [searchQuery, selectedStaffType, doctors, nurses]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStaffTypeChange = (e) => {
    setSelectedStaffType(e.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleOpenDetailModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedStaff(null);
  };

  const resetForm = () => {
    setNewStaffDetails({
      name: '',
      position: '',
      department: '',
      contact: '',
      email: '',
      address: '',
      gender: '',
      experience: '',
      shift: '',
      assignedDoctor: '',
    });
  };

  const handleNewStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaffDetails({ ...newStaffDetails, [name]: value });
  };

  const handleNewStaffSubmit = async () => {
    try {
      await addStaff(newStaffDetails);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
  };

  const handleDeleteStaff = (staffId) => {
    setFilteredStaff((prev) => prev.filter((staff) => staff.id !== staffId));
  };
  
  const handleUpdateStaff = (updatedStaff) => {
    if (!updatedStaff) return;
  
    if (selectedStaffType === 'doctors') {
      setDoctors((prev) =>
        prev.map((doctor) => (doctor.id === updatedStaff.id ? updatedStaff : doctor))
      );
    } else {
      setNurses((prev) =>
        prev.map((nurse) => (nurse.id === updatedStaff.id ? updatedStaff : nurse))
      );
    }
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

  const sortedStaff = filteredStaff.sort((a, b) => (
    order === 'asc' ? sortComparator(a, b, orderBy) : sortComparator(b, a, orderBy)
  ));
  

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, ml: '16rem', overflowY: 'auto', maxHeight: '100vh-10px', p: 3 }}>
        <Heading text="Staff Management" />
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Staff"
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
          <Typography variant="h6">Staff List</Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenModal}>
            Add New Staff
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="select-staff-type-label">Select Staff Type</InputLabel>
            <Select
              labelId="select-staff-type-label"
              value={selectedStaffType}
              onChange={handleStaffTypeChange}
              label="Select Staff Type"
            >
              <MenuItem value="doctors">Doctors</MenuItem>
              <MenuItem value="nurses">Nurses</MenuItem>
            </Select>
          </FormControl>
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
                    Staff ID
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
                <TableCell sortDirection={orderBy === 'position' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'position'}
                    direction={orderBy === 'position' ? order : 'asc'}
                    onClick={() => handleRequestSort('position')}
                  >
                    Position
                  </TableSortLabel>
                </TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell sortDirection={orderBy === 'department' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'department'}
                    direction={orderBy === 'department' ? order : 'asc'}
                    onClick={() => handleRequestSort('department')}
                  >
                    Department
                  </TableSortLabel>
                </TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStaff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>{staffMember.id}</TableCell>
                  <TableCell>{staffMember.name}</TableCell>
                  <TableCell>{staffMember.position}</TableCell>
                  <TableCell>{staffMember.specialization}</TableCell>
                  <TableCell>{staffMember.department}</TableCell>
                  <TableCell>{staffMember.contact}</TableCell>
                  <TableCell>
                    <Button variant="outlined" startIcon={<Info />} onClick={() => handleOpenDetailModal(staffMember)}>
                      Show More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <NewStaffModal
        open={openModal}
        onClose={handleCloseModal}
        newStaffDetails={newStaffDetails}
        onChange={handleNewStaffChange}
        onSubmit={handleNewStaffSubmit}
      />

      <StaffDetailsModal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        selectedStaff={selectedStaff}
        onDelete={handleDeleteStaff}
        onUpdate={handleUpdateStaff}
      />
    </Layout>
  );
};

export default Staff;
