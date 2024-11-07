import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import './RosterManager.css';

function RosterManager() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Trigger edit popup on edit icon click
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true); // Edit mode
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsEditMode(false); // Close both views
  };

  return (
    <div className="paddings innerWidth">
      <EmployeeList onEditClick={handleEditClick} />
      {selectedEmployee && isEditMode && (
        <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
      )}
    </div>
  );
}

export default RosterManager;
