import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import EmployeeAddCard from '../EmployeeAddCard/EmployeeAddCard';
import EmployeeDeleteCard from '../EmployeeDeleteCard/EmployeeDeleteCard'; // Import the EmployeeDeleteCard component
import './RosterManager.css';

function RosterManager() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false); // Add state for Delete mode

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsEditMode(true);
    };

    const handleAddClick = () => {
        setIsAddMode(true);
    };

    const handleDeleteClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDeleteMode(true); // Switch to Delete mode
    };

    const handleClose = () => {
        setSelectedEmployee(null);
        setIsEditMode(false);
        setIsAddMode(false);
        setIsDeleteMode(false); // Close Delete mode as well
    };

    const handleDeleteEmployee = (terminationReason) => {
        // Perform deletion logic here, e.g., call an API or update state
        console.log(`Deleting employee with reason: ${terminationReason}`);
        handleClose(); // Close the delete card after deletion
    };


    return (
        <div className="paddings innerWidth">
            <EmployeeList
                onEditClick={handleEditClick}
                onAddClick={handleAddClick}
                onDeleteClick={handleDeleteClick} // Pass the onDeleteClick function to EmployeeList
                hasPermissions={true}
            />
            {selectedEmployee && isEditMode && (
                <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
            )}
            {isAddMode && (
                <EmployeeAddCard onClose={handleClose} />
            )}
            {selectedEmployee && isDeleteMode && (
                <EmployeeDeleteCard
                    employee={selectedEmployee}
                    onClose={handleClose}
                    onDelete={handleDeleteEmployee} // Pass the onDelete function
                />
            )}

        </div>
    );
}

export default RosterManager;
