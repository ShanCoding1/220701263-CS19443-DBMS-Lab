// DataContext.js
import React, { createContext, useEffect, useState } from 'react';

const DataContext = createContext();

const transformData = (data, type) => {
  if (data.status === 'success' && Array.isArray(data[type])) {
    return data[type].map((item) => ({
      id: item._id,
      name: item.name || 'N/A',
      position: type === 'doctors' ? 'Doctor' : type === 'nurses' ? 'Nurse' : item.role || 'N/A',
      specialization: item.specialization || 'N/A',
      department: item.department || 'N/A',
      contact: item.contact_number || 'N/A',
      email: item.email || 'N/A',
      address: item.address || 'N/A',
      experience: item.experience_years || 'N/A',
      age: item.age || 'N/A',
      gender: item.gender || 'N/A',
      education: item.education || 'N/A',
      shift: item.shift || 'N/A',
    }));
  } else {
    throw new Error('Invalid data format');
  }
};


const transformPatientData = (data) => {
  if (data.status === 'success' && Array.isArray(data.patients)) {
    return data.patients.map((item) => ({
      id: item._id,
      name: item.name || 'N/A',
      age: item.age || 'N/A',
      weight: item.weight || 'N/A',
      height: item.height || 'N/A',
      contact: item.contact || 'N/A',
      email: item.email || 'N/A',
      address: item.address || 'N/A',
      gender: item.gender || 'N/A',
      bloodGroup: item.bloodGroup || 'N/A',
      appointments: item.appointments.length ? item.appointments : 'N/A',
    }));
  } else {
    console.error('Invalid patient data format:', data);
    return [];
  }
};



const transformAppointmentData = (data) => {
  if (data.status === 'success' && Array.isArray(data.appointments)) {
    return data.appointments.map((item) => ({
      id: item._id,
      patientId: item.patient_id || 'N/A',
      doctorId: item.doctor_id || 'N/A',
      patientName: item.patient_name || 'N/A',
      doctorName: item.doctor_name || 'N/A',
      appointmentTime: item.appointment_time || 'N/A',
      department: item.department || 'N/A',
      reason: item.reason || 'N/A'
    }));
  } else {
    throw new Error('Invalid appointment data format');
  }
};

export const DataProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/patients/');
        const data = await res.json();
        const transformedData = transformPatientData(data);
        setPatients(transformedData);
        console.log('Transformed Patient Data:', transformedData);
      } catch (error) {
        console.error('Error fetching and transforming patients:', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/doctor/');
        const data = await res.json();
        const transformedData = transformData(data, 'doctors');
        setDoctors(transformedData);
        console.log('Transformed Doctor Data:', transformedData);
      } catch (error) {
        console.error('Error fetching and transforming doctors:', error);
      }
    };

    const fetchNurses = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/nurse/');
        const data = await res.json();
        const transformedData = transformData(data, 'nurses');
        setNurses(transformedData);
        console.log('Transformed Nurse Data:', transformedData);
      } catch (error) {
        console.error('Error fetching and transforming nurses:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/appointment/');
        const data = await res.json();
        const transformedData = transformAppointmentData(data);
        setAppointments(transformedData);
        console.log('Transformed Appointment Data:', transformedData);
      } catch (error) {
        console.error('Error fetching and transforming appointments:', error);
      }
    };

    fetchPatients();
    fetchDoctors();
    fetchNurses();
    fetchAppointments();
  }, []);

  return (
    <DataContext.Provider value={{ departments, patients, nurses, doctors, appointments, setDoctors, setPatients, setAppointments }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return React.useContext(DataContext);
};
