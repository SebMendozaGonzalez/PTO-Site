import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import './RosterManager.css';

function RosterManager() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true); 
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsEditMode(false); 
  };

  return (
    <div className="paddings innerWidth">
      <EmployeeList 
        onEditClick={handleEditClick}
        hasPermissions={true}
      />
      {selectedEmployee && isEditMode && (
        <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
      )}
    </div>
  );
}

export default RosterManager;

