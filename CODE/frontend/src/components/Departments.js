import React, { useState, useEffect } from 'react';
import DepartmentTable from './DepartmentTable'; // Assuming DepartmentTable is in the same directory

const YourComponent = () => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const staticDepartments = [
      { "index": "DEPT01", "name": 'Cardiology', "staffs": 20, "appointments": 150 },
      { "index": "DEPT02", "name": 'Neurology', "staffs": 15, "appointments": 120 },
      { "index": "DEPT03", "name": 'Orthopedics', "staffs": 18, "appointments": 130 },
      { "index": "DEPT04", "name": 'Pediatrics', "staffs": 25, "appointments": 170 },
      { "index": "DEPT05", "name": 'Dermatology', "staffs": 12, "appointments": 100 },
      { "index": "DEPT06", "name": 'Oncology', "staffs": 22, "appointments": 160 },
      { "index": "DEPT07", "name": 'Gynecology', "staffs": 17, "appointments": 140 },
    ];

    setDepartments(staticDepartments);
  }, []);

  return (
    <div>
      <DepartmentTable departments={departments} />
    </div>
  );
};

export default YourComponent;
