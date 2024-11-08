import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import EmployeeAddCard from '../EmployeeAddCard/EmployeeAddCard';
import EmployeeDeleteCard from '../EmployeeDeleteCard/EmployeeDeleteCard';
import './RosterManager.css';

function RosterManager({ filterLeaderEmail, onEmployeeSelect, hasPermissions }) {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsEditMode(true);
    };

    const handleAddClick = () => {
        setIsAddMode(true);
    };

    const handleDeleteClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDeleteMode(true);
    };

    const handleClose = () => {
        setSelectedEmployee(null);
        setIsEditMode(false);
        setIsAddMode(false);
        setIsDeleteMode(false);
    };

    const handleDeleteEmployee = (terminationReason) => {
        console.log(`Deleting employee with reason: ${terminationReason}`);
        handleClose();
    };

    return (
        <div className="paddings innerWidth">
            <EmployeeList
                filterLeaderEmail={filterLeaderEmail}
                onEmployeeSelect={onEmployeeSelect} // Pass the function to select an employee
                onEditClick={handleEditClick}
                onAddClick={handleAddClick}
                onDeleteClick={handleDeleteClick}
                hasPermissions={hasPermissions}
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
                    onDelete={handleDeleteEmployee}
                />
            )}
        </div>
    );
}

export default RosterManager;
