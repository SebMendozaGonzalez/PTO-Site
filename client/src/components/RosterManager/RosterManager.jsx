import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import EmployeeAddCard from '../EmployeeAddCard/EmployeeAddCard'; // Import the EmployeeAddCard component
import './RosterManager.css';

function RosterManager() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // Add state for Add mode

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true); 
  };

  const handleAddClick = () => {
    setIsAddMode(true); // Switch to Add mode
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsEditMode(false);
    setIsAddMode(false); // Close Add mode as well
  };

  return (
    <div className="paddings innerWidth">
      <EmployeeList 
        onEditClick={handleEditClick}
        onAddClick={handleAddClick} // Pass the onAddClick function
        hasPermissions={true}
      />
      {selectedEmployee && isEditMode && (
        <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
      )}
      {isAddMode && (
        <EmployeeAddCard onClose={handleClose} /> // Render the EmployeeAddCard in Add mode
      )}
    </div>
  );
}

export default RosterManager;
