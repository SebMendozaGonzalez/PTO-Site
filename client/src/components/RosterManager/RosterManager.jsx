import React, { useState } from 'react';
import EmployeeList from '../EmployeeList/EmployeeList';
import EmployeeEditCard from '../EmployeeEditCard/EmployeeEditCard';
import EmployeeAddCard from '../EmployeeAddCard/EmployeeAddCard';
import EmployeeDeleteCard from '../EmployeeDeleteCard/EmployeeDeleteCard';
import EmployeeLicenseCard from '../EmployeeLicenseCard/EmployeeLicenseCard';
import './RosterManager.css';

function RosterManager({ filterLeaderEmail, onEmployeeSelect, hasPermissions }) {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isLicenseMode, setIsLicenseMode] = useState(false);

    const handleLicenseClick = (employee) => {
        setSelectedEmployee(employee);
        setIsLicenseMode(true);
    };

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
        setIsLicenseMode(false);
    };

    const handleDeleteEmployee = (terminationReason) => {
        console.log(`Deleting employee with reason: ${terminationReason}`);
        handleClose();
    };

    return (
        <div className="paddings innerWidth roster-manager">
            <EmployeeList
                filterLeaderEmail={filterLeaderEmail}
                onEmployeeSelect={onEmployeeSelect} // Pass the function to select an employee
                onEditClick={handleEditClick}
                onAddClick={handleAddClick}
                onDeleteClick={handleDeleteClick}
                hasPermissions={hasPermissions}
                onLicenseClick={handleLicenseClick} // Ensure the license click functionality is passed
            />

            {selectedEmployee && isEditMode && (
                <EmployeeEditCard employee={selectedEmployee} onClose={handleClose} />
            )}

            {isAddMode && <EmployeeAddCard onClose={handleClose} />}

            {selectedEmployee && isDeleteMode && (
                <EmployeeDeleteCard
                    employee={selectedEmployee}
                    onClose={handleClose}
                    onDelete={handleDeleteEmployee}
                />
            )}

            {selectedEmployee && isLicenseMode && (
                <EmployeeLicenseCard
                    employeeId={selectedEmployee.employee_id} // Correct prop name
                    onClose={handleClose}
                />
            )}
        </div>
    );
}

export default RosterManager;
