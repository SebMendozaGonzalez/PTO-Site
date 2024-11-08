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
    const [isDeleteMode, setIsDeleteMode] = useState(false); // State for Delete mode

    // Handles clicking on an employee for editing
    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsEditMode(true);
    };

    // Handles clicking the "Add Employee" button
    const handleAddClick = () => {
        setIsAddMode(true);
    };

    // Handles clicking the "Delete Employee" button
    const handleDeleteClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDeleteMode(true); // Switch to Delete mode
    };

    // Close all modals (edit, add, delete)
    const handleClose = () => {
        setSelectedEmployee(null);
        setIsEditMode(false);
        setIsAddMode(false);
        setIsDeleteMode(false); // Close Delete mode
    };

    // Handles employee deletion after receiving the termination reason
    const handleDeleteEmployee = (terminationReason) => {
        // Here you can perform your actual deletion logic (e.g., call an API)
        console.log(`Deleting employee with reason: ${terminationReason}`);

        // After deletion logic, close the modal
        handleClose();
    };

    return (
        <div className="paddings innerWidth">
            <EmployeeList
                onEditClick={handleEditClick}   
                onAddClick={handleAddClick}         
                onDeleteClick={handleDeleteClick}   
                hasPermissions={true}               
            />
            
            {/* Render EmployeeEditCard if in edit mode */}
            {selectedEmployee && isEditMode && (
                <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
            )}

            {/* Render EmployeeAddCard if in add mode */}
            {isAddMode && (
                <EmployeeAddCard onClose={handleClose} />
            )}

            {/* Render EmployeeDeleteCard if in delete mode */}
            {selectedEmployee && isDeleteMode && (
                <EmployeeDeleteCard
                    employee={selectedEmployee}
                    onClose={handleClose}     
                    onDelete={handleDeleteEmployee} 
                />
            )}
        </div>
    );
}

export default RosterManager;

